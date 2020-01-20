const path = require('path');
const fs = require('fs');
const slash = require('slash');
const md5File = require('md5-file');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const { resourceName } = require('./utils');
const {
    LANGUAGE,
    TITLE,
    DESCRIPTION,
    THEME_COLOR,
    BACKGROUND_COLOR,
    SENTRY_DSN,
    PUBLIC_PATH_DEFAULT,
    PUBLIC_PATH_SANDBOX,
    PUBLIC_PATH_BITRIX,
    SRC_PATH,
    BUILD_PATH,
    HTML_PRETTY,
    USE_SERVICE_WORKER,
} = require('../webpack.settings');
const { name: PACKAGE_NAME, browserslist } = require('../package.json');

const { ENV, NODE_ENV } = process.env;
const SANDBOX = ENV === 'sandbox';
const BITRIX = ENV === 'bitrix';

const configurePublicPath = () => {
    if (SANDBOX) return PUBLIC_PATH_SANDBOX;
    if (BITRIX) return PUBLIC_PATH_BITRIX;
    return PUBLIC_PATH_DEFAULT;
};

const configureRootPath = () => {
    if (SANDBOX) return PUBLIC_PATH_SANDBOX;
    return '/';
};

const SITEMAP = glob.sync(`${slash(SRC_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SRC_PATH)}/partials/**/*.html`,
        `${slash(SRC_PATH)}/google*.html`,
        `${slash(SRC_PATH)}/yandex_*.html`,
    ],
});

const PUBLIC_PATH = configurePublicPath();
const ROOT_PATH = configureRootPath();
// const WATCH = process.argv.indexOf('--watch') !== -1 || process.argv.indexOf('-w') !== -1;
const PROD = NODE_ENV === 'production';
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const SERVICE_WORKER_BASE = slash(path.relative(PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(BUILD_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => (fs.existsSync(SERVICE_WORKER_PATH) ? md5File.sync(SERVICE_WORKER_PATH) : '');
const LEGACY_TYPE = 'legacy';
const MODERN_TYPE = 'modern';

const configureHtmlWebpackPlugin = (useHtml) => {
    if (useHtml) {
        return SITEMAP.map((template) => {
            const basename = path.basename(template);
            const filename =
                basename === 'index.html'
                    ? path.join(BUILD_PATH, path.relative(SRC_PATH, template))
                    : path.join(
                          BUILD_PATH,
                          path.relative(SRC_PATH, path.dirname(template)),
                          path.basename(template, '.html'),
                          'index.html',
                      );
            return new HtmlWebpackPlugin({
                filename,
                template,
                inject: true,
                minify: {
                    removeScriptTypeAttributes: true,
                    html5: true,
                    conservativeCollapse: false,
                    collapseWhitespace: !HTML_PRETTY,
                    removeComments: !HTML_PRETTY,
                    decodeEntities: !HTML_PRETTY,
                    minifyCSS: !HTML_PRETTY,
                    minifyJS: !HTML_PRETTY,
                },
                hash: !PROD,
                cache: true,
                title: TITLE,
            });
        });
    }

    return [];
};

const configureHtmlLoader = () => ({
    test: /\.html$/i,
    loader: './webpack/loaders/loader.html.js',
    options: {
        context: {
            LANGUAGE,
            TITLE,
            DESCRIPTION,
            THEME_COLOR,
            BACKGROUND_COLOR,
            SENTRY_DSN,
            ROOT_PATH,
            PUBLIC_PATH,
            NODE_ENV,
        },
        searchPath: SRC_PATH,
    },
});

const configureBabelLoader = (supportsESModules) => ({
    test: /\.(js|ts)x?$/i,
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    exclude: {
        test: path.join(__dirname, '../node_modules'),
        // ...(supportsESModules
        //     ? {}
        //     : {
        //           exclude: {
        //               test: [
        //                   path.resolve(__dirname, '../node_modules/idlize'),
        //               ],
        //           },
        //       }),
    },
    loaders: [
        {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                plugins: [
                    'babel-plugin-transform-async-to-promises',
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            corejs: 3,
                        },
                    ],
                    [
                        '@babel/plugin-syntax-dynamic-import',
                        {
                            allChunks: true,
                        },
                    ],
                    [
                        '@babel/plugin-transform-react-jsx',
                        {
                            pragma: 'h',
                            pragmaFrag: 'Fragment',
                        },
                    ],
                ],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            loose: true,
                            corejs: 3,
                            useBuiltIns: 'usage',
                            targets: {
                                ...(supportsESModules ? { esmodules: true } : { browsers: browserslist }),
                            },
                        },
                    ],
                    [
                        '@babel/preset-typescript',
                        {
                            jsxPragma: 'h',
                            isTSX: true,
                            allExtensions: true,
                        },
                    ],
                ],
                envName: NODE_ENV,
            },
        },
    ],
});

// const configureGlslLoader = () => ({
//     test: /\.glsl$/i,
//     loader: 'webpack-glsl-loader',
// });

const configureImageLoader = () => ({
    test: /\.(jpe?g|png|gif|svg)$/i,
    exclude: /(fonts|font)/i,
    oneOf: [
        {
            resourceQuery: /[&?]resize=.+/,
            loader: './webpack/loaders/loader.resize.js',
            options: { name: resourceName('img'), limit: 32 * 1024 },
        },
        {
            resourceQuery: /[&?]inline=inline/,
            loader: 'url-loader',
            options: { name: resourceName('img'), limit: 32 * 1024 },
        },
        {
            loader: 'file-loader',
            options: { name: resourceName('img') },
        },
    ],
});

const configureFontLoader = () => ({
    test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
    exclude: /(img|images)/i,
    loader: 'file-loader',
    options: {
        name: resourceName('fonts', false),
    },
});

const configureCssLoader = () => ({
    test: /\.(css|scss)$/i,
    loaders: (DEV_SERVER ? ['css-hot-loader'] : []).concat([
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: { sourceMap: USE_SOURCE_MAP },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                config: { path: './webpack/postcss.config.js' },
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: USE_SOURCE_MAP,
            },
        },
    ]),
});

const configureManifest = (fileName) => ({ fileName });

const configureServiceWorker = (useServiceWorker) => {
    if (useServiceWorker) {
        return [
            new WorkboxPlugin.GenerateSW({
                cacheId: PACKAGE_NAME,
                swDest: SERVICE_WORKER_PATH,
                importWorkboxFrom: 'local',
                clientsClaim: true,
                skipWaiting: true,
                precacheManifestFilename: slash(
                    path.join(SERVICE_WORKER_BASE, 'service-worker-precache.js?[manifestHash]'),
                ),
                globDirectory: slash(BUILD_PATH),
                globPatterns: ['js/**/*.js', 'css/*.css', 'fonts/*.woff2'],
                globIgnores: ['*.map', '*.LICENSE'],
                include: [],
                runtimeCaching: [
                    {
                        urlPattern: new RegExp(`${PUBLIC_PATH}(css|js|fonts)/`),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: `${PACKAGE_NAME}-assets`,
                            networkTimeoutSeconds: 10,
                        },
                    },
                    {
                        urlPattern: /\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: `${PACKAGE_NAME}-html`,
                            networkTimeoutSeconds: 10,
                        },
                    },
                ],
                ignoreURLParametersMatching: [/^utm_/, /^[a-fA-F0-9]{32}$/],
            }),
        ];
    }

    return [];
};

const configureDefinePlugin = (buildType) => ({
    NODE_ENV: JSON.stringify(NODE_ENV),
    ENV: JSON.stringify(process.env.ENV),
    PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
    ROOT_PATH: JSON.stringify(ROOT_PATH),
    SENTRY_DSN: JSON.stringify(SENTRY_DSN),
    BUILD_TYPE: JSON.stringify(buildType),
    USE_SERVICE_WORKER,
    SERVICE_WORKER_HASH,
});

const configureJsFilename = (buildType, isProd) => `js/${buildType}/[name].js`;

const configureCopyPlugin = () =>
    new CopyWebpackPlugin(
        [
            ...[
                '**/.htaccess',
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                'google*.html',
                'yandex_*.html',
                '*.txt',
                'fonts/*',
                'audio/**/*',
                'video/**/*',
                'upload/**/*',
                'php/*.php',
            ].map((from) => ({
                from,
                to: BUILD_PATH,
                context: SRC_PATH,
                ignore: SITEMAP,
                cache: !PROD,
            })),
            ...['node_modules/lightgallery.js/dist/**/*'].map((from) => ({
                from,
                to: BUILD_PATH,
                context: '../',
                cache: !PROD,
            })),
        ],
        {
            copyUnmodified: !PROD,
            debug: 'info',
        },
    );

const configureCleanWebpackPlugin = () =>
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
        cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
    });

const configureComlinkLoader = () => ({
    // TODO: add ts support
    test: /\.worker\.(js|ts)$/i,
    use: [
        {
            loader: 'comlink-loader',
            options: {
                singleton: true,
            },
        },
    ],
});

const baseConfig = {
    name: PACKAGE_NAME,

    entry: {
        app: `${SRC_PATH}/js/app.ts`,
    },

    output: {
        path: BUILD_PATH,
        publicPath: PUBLIC_PATH,
    },

    optimization: {
        splitChunks: {
            chunks: 'initial',
            name: 'vendor',
        },
    },

    module: {
        rules: [
            configureHtmlLoader(),
            configureFontLoader(),
            configureImageLoader(),
            configureCssLoader(),
            configureComlinkLoader(),
        ],
    },

    plugins: [
        // ...(WATCH ? [new BrowserSyncPlugin({ host: 'localhost', port: 8080 })] : []),
        new MiniCssExtractPlugin({
            filename: `css/app.css`,
            allChunks: true,
            chunkFilename: 'css/[name].css',
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
        },
    },
};

const legacyConfig = {
    output: {
        filename: configureJsFilename(LEGACY_TYPE, PROD),
        chunkFilename: configureJsFilename(LEGACY_TYPE, PROD),
    },

    module: {
        rules: [configureBabelLoader()],
    },

    plugins: [
        new webpack.DefinePlugin(configureDefinePlugin(LEGACY_TYPE)),
        new ManifestPlugin(configureManifest('manifest-legacy.json')),
    ],
};

const modernConfig = {
    output: {
        filename: configureJsFilename(MODERN_TYPE, PROD),
        chunkFilename: configureJsFilename(MODERN_TYPE, PROD),
    },

    module: {
        rules: [configureBabelLoader(true)],
    },

    plugins: [
        new webpack.DefinePlugin(configureDefinePlugin(MODERN_TYPE)),
        new ManifestPlugin(configureManifest('manifest-modern.json')),
        ...configureServiceWorker(USE_SERVICE_WORKER),
    ],

    resolve: {
        alias: {
            '@barba/core': path.resolve(__dirname, '../node_modules/@barba/core/dist/barba.mjs'),
        },
    },
};

module.exports = {
    legacyConfig: merge.strategy({
        module: 'prepend',
        plugins: 'prepend',
    })(baseConfig, legacyConfig),

    modernConfig: merge.strategy({
        module: 'prepend',
        plugins: 'prepend',
    })(baseConfig, modernConfig),

    configureHtmlWebpackPlugin,
    configureCopyPlugin,
    configureCleanWebpackPlugin,
    SERVICE_WORKER_PATH,
    LEGACY_TYPE,
    MODERN_TYPE,
    USE_SOURCE_MAP,
};
