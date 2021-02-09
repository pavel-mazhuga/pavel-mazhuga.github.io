/* eslint-disable max-lines, global-require */
const path = require('path');
const fs = require('fs');
const slash = require('slash');
const md5File = require('md5-file');
const glob = require('glob');
const webpack = require('webpack');
const { customizeObject, mergeWithCustomize } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const BitrixInsertHashesPlugin = require('./plugins/plugin.bitrix-insert-hashes');
const { resourceName } = require('./utils');
const configurePostCSS = require('./postcss.config.js');
const {
    LANGUAGE,
    TITLE,
    DESCRIPTION,
    THEME_COLOR,
    BACKGROUND_COLOR,
    SENTRY_DSN,
    ROOT_PATH_DEFAULT,
    ROOT_PATH_SANDBOX,
    ROOT_PATH_BITRIX,
    PUBLIC_PATH_DEFAULT,
    PUBLIC_PATH_SANDBOX,
    PUBLIC_PATH_BITRIX,
    SRC_PATH,
    BUILD_PATH,
    HTML_PATH_BITRIX,
    HTML_PRETTY,
    USE_HTML,
    USE_SERVICE_WORKER,
    USE_FAVICONS,
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
    if (SANDBOX) return ROOT_PATH_SANDBOX;
    if (BITRIX) return ROOT_PATH_BITRIX;
    return ROOT_PATH_DEFAULT;
};

const SITEMAP = glob.sync(`${slash(SRC_PATH)}/templates/**/*.html`, {
    ignore: [
        `${slash(SRC_PATH)}/templates/partials/**/*.html`,
        `${slash(SRC_PATH)}/google*.html`,
        `${slash(SRC_PATH)}/yandex_*.html`,
    ],
});

const PUBLIC_PATH = configurePublicPath();
const ROOT_PATH = configureRootPath();
const PROD = NODE_ENV === 'production';
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const SERVICE_WORKER_BASE = slash(path.relative(PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(BUILD_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => (fs.existsSync(SERVICE_WORKER_PATH) ? md5File.sync(SERVICE_WORKER_PATH) : '');
const LEGACY_TYPE = 'legacy';
const MODERN_TYPE = 'modern';
const hash = !PROD ? 'hash' : 'contenthash';

const configureCssFilename = (isProd) => (isProd ? `css/[name].[${hash}:8].css` : `css/[name].css?[${hash}:8]`);
const configureJsFilename = (buildType, isProd) =>
    isProd ? `js/${buildType}/[name].[${hash}:8].js` : `js/${buildType}/[name].js?[${hash}:8]`;

const configureHtmlWebpackPlugin = (useHtml) => {
    if (useHtml) {
        return SITEMAP.map((template) => {
            const basename = path.basename(template);
            const filename =
                basename === 'index.html'
                    ? path.join(
                          BUILD_PATH,
                          ...(BITRIX ? [HTML_PATH_BITRIX] : []),
                          path.relative(SRC_PATH, template.replace('/templates', '')),
                      )
                    : path.join(
                          BUILD_PATH,
                          ...(BITRIX ? [HTML_PATH_BITRIX] : []),
                          path.relative(SRC_PATH, path.dirname(template).replace('/templates', '')),
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
                cache: false,
                title: TITLE,
            });
        });
    }

    return [];
};

const configureFaviconsWebpackPlugin = () =>
    new FaviconsWebpackPlugin({
        logo: `${SRC_PATH}/img/favicon/favicon.png`,
        cache: true,
        inject: USE_HTML,
    });

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
    },
});

const configureVueLoader = () => ({
    test: /\.vue$/,
    loader: 'vue-loader',
});

const babelLoader = (supportsESModules = false) => ({
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
        plugins: [
            'babel-plugin-transform-async-to-promises',
            [
                '@babel/plugin-transform-runtime',
                {
                    regenerator: false,
                    useESModules: supportsESModules,
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
                    exclude: supportsESModules ? ['es.promise'] : [],
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
});

const configureBabelLoader = (supportsESModules = false) => ({
    test: /\.(js|mjs|jsx|ts|tsx)?$/i,
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
    },
    exclude: path.join(__dirname, '../node_modules'),
    // exclude: {
    //     test: path.join(__dirname, '../node_modules'),
    //     // ...(supportsESModules
    //     //     ? {}
    //     //     : {
    //     //           exclude: {
    //     //               test: [
    //     //                   path.resolve(__dirname, '../node_modules/idlize'),
    //     //               ],
    //     //           },
    //     //       }),
    // },
    use: [babelLoader(supportsESModules)],
});

const configureGlslLoader = () => ({
    test: /\.glsl$/i,
    loader: 'webpack-glsl-loader',
});

const configureImageLoader = () => ({
    test: /\.(jpe?g|png|gif)$/i,
    oneOf: [
        {
            resourceQuery: /[&?]resize=.+/,
            loader: './webpack/loaders/loader.resize.js',
            options: { name: resourceName('img'), limit: 32 * 1024, esModule: false },
        },
        {
            resourceQuery: /[&?]inline=inline/,
            loader: 'url-loader',
            options: { name: resourceName('img'), limit: 32 * 1024, esModule: false },
        },
        {
            loader: 'file-loader',
            options: { name: resourceName('img') },
        },
    ],
});

const configureFontLoader = () => ({
    test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
    loader: 'file-loader',
    options: {
        name: resourceName('fonts', false),
    },
});

const configureCustomElementsCssLoader = () => ({
    test: /\.ce\.(css|scss)$/i,
    use: (DEV_SERVER ? ['css-hot-loader'] : []).concat([
        {
            loader: 'raw-loader',
        },
        {
            loader: 'extract-loader',
        },
        {
            loader: 'css-loader',
            options: { sourceMap: USE_SOURCE_MAP },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                postcssOptions: configurePostCSS(PROD),
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

const configureCssLoader = () => ({
    test: /\.(css|scss)$/i,
    exclude: /\.ce\.(css|scss)$/i,
    use: (DEV_SERVER ? ['css-hot-loader'] : []).concat([
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: { sourceMap: USE_SOURCE_MAP },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                postcssOptions: configurePostCSS(PROD),
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
            new WorkboxPlugin.InjectManifest({
                swSrc: path.resolve(SRC_PATH, 'js/service-worker/service-worker.js'),
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

const configureCopyPlugin = () =>
    new CopyWebpackPlugin({
        patterns: [
            ...[
                '**/.htaccess',
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp,exr,avif,ktx,ktx2}',
                'google*.html',
                'yandex_*.html',
                '*.txt',
                'fonts/**/*',
                'audio/**/*',
                'video/**/*',
                'upload/**/*',
                'php/**/*.php',
                'php_includes/*.php',
            ].map((from) => ({
                from,
                to: BUILD_PATH,
                context: SRC_PATH,
                cacheTransform: true,
                noErrorOnMissing: true,
                globOptions: {
                    ignore: SITEMAP,
                },
            })),
            ...['node_modules/lightgallery.js/dist/**/*'].map((from) => ({
                from,
                to: BUILD_PATH,
                context: '../',
                cacheTransform: true,
                noErrorOnMissing: true,
            })),
        ],
    });

const configureCleanWebpackPlugin = () =>
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
        cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
    });

const configureWorkerLoader = (supportsESModules = false) => ({
    test: /\.named-worker\.(js|ts)$/i,
    use: [
        {
            loader: 'worker-loader',
            options: {
                name: `js/${process.env.BUILD_TYPE === LEGACY_TYPE ? LEGACY_TYPE : MODERN_TYPE}/[name].js`,
            },
        },
        babelLoader(supportsESModules),
    ],
});

const configureComlinkLoader = (supportsESModules = false) => ({
    test: /\.worker\.(js|ts)$/i,
    use: [
        {
            loader: 'comlink-loader',
            options: {
                singleton: true,
            },
        },
        babelLoader(supportsESModules),
    ],
});

const configureBitrixInsertHashesPlugin = () =>
    new BitrixInsertHashesPlugin({
        css: {
            srcTemplatePath: path.join(__dirname, '../src/php_includes/css.php'),
            destTemplatePath: path.join(__dirname, '../build/php_includes/css.php'),
        },
        js: {
            srcTemplatePath: path.join(__dirname, '../src/php_includes/js.php'),
            destTemplatePath: path.join(__dirname, '../build/php_includes/js.php'),
        },
    });

const configureBrowsersync = () =>
    new BrowserSyncPlugin(
        {
            host: 'localhost',
            port: 4000,
            open: false,
            proxy: 'http://localhost:9080/',
        },
        {
            // prevent BrowserSync from reloading the page
            // and let Webpack Dev Server take care of this
            reload: false,
        },
    );

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
        runtimeChunk: true,
    },

    module: {
        rules: [
            configureHtmlLoader(),
            configureFontLoader(),
            configureImageLoader(),
            configureCustomElementsCssLoader(),
            configureCssLoader(),
            configureGlslLoader(),
            configureVueLoader(),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: configureCssFilename(PROD),
            chunkFilename: configureCssFilename(PROD),
        }),
        new VueLoaderPlugin(),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
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
        rules: [configureComlinkLoader(), configureWorkerLoader(), configureBabelLoader()],
    },

    plugins: [
        new webpack.DefinePlugin(configureDefinePlugin(LEGACY_TYPE)),
        new WebpackManifestPlugin(configureManifest('manifest-legacy.json')),
    ],
};

const modernConfig = {
    output: {
        filename: configureJsFilename(MODERN_TYPE, PROD),
        chunkFilename: configureJsFilename(MODERN_TYPE, PROD),
    },

    module: {
        rules: [configureComlinkLoader(true), configureWorkerLoader(true), configureBabelLoader(true)],
    },

    plugins: [
        new webpack.DefinePlugin(configureDefinePlugin(MODERN_TYPE)),
        new WebpackManifestPlugin(configureManifest('manifest-modern.json')),
        configureCopyPlugin(),
        ...configureServiceWorker(USE_SERVICE_WORKER),
        ...(BITRIX ? [configureBitrixInsertHashesPlugin()] : []),
        ...(USE_FAVICONS ? [configureFaviconsWebpackPlugin()] : []),
    ],

    resolve: {
        alias: {
            '@barba/core': path.resolve(__dirname, '../node_modules/@barba/core/dist/barba.mjs'),
            comlink: path.resolve(__dirname, '../node_modules/comlink/dist/esm/comlink.min.mjs'),
        },
    },
};

module.exports = {
    legacyConfig: mergeWithCustomize({
        customizeObject: customizeObject({
            entry: 'prepend',
        }),
    })(baseConfig, legacyConfig),

    modernConfig: mergeWithCustomize({
        customizeObject: customizeObject({
            entry: 'prepend',
        }),
    })(baseConfig, modernConfig),

    configureHtmlWebpackPlugin,
    configureBrowsersync,
    configureCleanWebpackPlugin,
    configureBabelLoader,
    SRC_PATH,
    BUILD_PATH,
    PUBLIC_PATH,
    SERVICE_WORKER_PATH,
    LEGACY_TYPE,
    MODERN_TYPE,
    USE_SOURCE_MAP,
};
