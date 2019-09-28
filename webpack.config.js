/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const webpack = require('webpack');
const slash = require('slash');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const md5File = require('md5-file');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ImageminPlugin = require('imagemin-webpack');
const HtmlWebpackModernBuildPlugin = require('./plugin.modern-build');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const WorkboxPlugin = require('workbox-webpack-plugin');

const APP = require('./app.config.js');

const PROD = process.env.NODE_ENV === 'production';
const SANDBOX = process.env.ENV === 'sandbox';
const BITRIX = process.env.ENV === 'bitrix';
const NODE_ENV = PROD ? 'production' : 'development';
const isModern = process.env.BUILD_TYPE === 'modern';
const WATCH = process.argv.indexOf('--watch') !== -1 || process.argv.indexOf('-w') !== -1;
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const USE_LINTERS = PROD;

const configurePublicPath = () => {
    if (SANDBOX) return APP.PUBLIC_PATH_SANDBOX;
    if (BITRIX) return APP.PUBLIC_PATH_BITRIX;
    return APP.PUBLIC_PATH;
};

const { SRC_PATH, BUILD_PATH } = APP;
const PUBLIC_PATH = configurePublicPath();
const ROOT_PATH = SANDBOX ? APP.PUBLIC_PATH_SANDBOX : '/';

const { browserslist, name: PACKAGE_NAME } = require('./package.json');
const SvgoPlugin = require('./plugin.svgo.js');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = (require('stylelint-webpack-plugin'));
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const FaviconsPlugin = require('./plugin.favicons.js');

const SITEMAP = glob.sync(`${slash(SRC_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SRC_PATH)}/partials/**/*.html`,
        `${slash(SRC_PATH)}/google*.html`,
        `${slash(SRC_PATH)}/yandex_*.html`,
    ],
});

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = hash ? '?[contenthash:8]' : '';
    return (resourcePath) => {
        const url = slash(path.relative(SRC_PATH, resourcePath));
        if (url.startsWith('../')) {
            return url.replace(/\.\.\//g, '') + suffix;
        }
        if (url.startsWith(`${basename}/`)) {
            return url + suffix;
        }
        if (url.startsWith('../node_modules/')) {
            const [, , modulename] = url.split('/', 3);
            return slash(path.join(basename, modulename, `[name].[ext]${suffix}`));
        }
        return slash(path.join(basename, `[name].[ext]${suffix}`));
    };
};

const SERVICE_WORKER_BASE = slash(path.relative(PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(BUILD_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => (fs.existsSync(SERVICE_WORKER_PATH) ? md5File.sync(SERVICE_WORKER_PATH) : '');

module.exports = {

    watchOptions: {
        ignored: /node_modules/,
    },

    devServer: {
        compress: false,
        open: true,
        inline: true,
        overlay: { warnings: false, errors: true },
        before(app) {
            app.get('/service-worker.js', (request, response) => response.sendFile(SERVICE_WORKER_PATH));
        },
    },

    entry: {
        app: `${SRC_PATH}/js/app.js`,
    },

    output: {
        filename: `js/${isModern ? 'modern' : 'legacy'}/[name].min${PROD ? '.[contenthash:8]' : ''}.js`,
        chunkFilename: `js/${isModern ? 'modern' : 'legacy'}/[name].min${PROD ? '.[contenthash:8]' : ''}.js`,
        path: BUILD_PATH,
        publicPath: PUBLIC_PATH,
    },

    optimization: {
        splitChunks: {
            chunks: 'initial',
            name: 'vendor',
        },
        minimizer: (PROD ? [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: true,
            }),
        ] : []),
    },

    performance: (PROD ? {
        assetFilter: (asset) => {
            const [filename] = asset.split('?', 2);
            const ignore = /(\.(css|js)\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize-.+)$/;
            return !(ignore.test(filename));
        },
        hints: 'warning',
        maxAssetSize: 3 * 1024 * 1024, // 3 MB
        maxEntrypointSize: 512 * 1024, // 512 KB
    } : false),

    plugins: [
        ...(WATCH ? [
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 8080,
            }),
    ] : []),
        new ManifestPlugin({
            fileName: `manifest-${isModern ? 'modern' : 'legacy'}.json`,
        }),
        ...(isModern ? [] : [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
                cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
            }),
        ]),
        new MiniCssExtractPlugin({
            filename: `css/app.min${PROD ? '.[contenthash:8]' : ''}.css`,
            allChunks: true,
        }),
        ...(PROD ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ] : []),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            ENV: JSON.stringify(process.env.ENV),
            PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
            ROOT_PATH: JSON.stringify(ROOT_PATH),
            SENTRY_DSN: JSON.stringify(APP.SENTRY_DSN),
        }),
        ...(USE_LINTERS && !isModern ? [
            new StyleLintPlugin({
                syntax: 'scss',
                files: '**/*.scss',
                configFile: './.stylelintrc',
                ignorePath: './.stylelintignore',
                emitErrors: false,
                failOnError: false,
                lintDirtyModulesOnly: DEV_SERVER,
                fix: false,
            }),
        ] : []),
        ...(APP.USE_FAVICONS && !isModern ? [
            new FaviconsPlugin.AppIcon({
                logo: path.join(__dirname, '.favicons-source-1024x1024.png'),
                prefix: 'img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                prefix: 'img/favicon/',
            }),
        ] : []),
        ...(APP.USE_HTML && (isModern || !PROD) ? SITEMAP.map((template) => {
            const basename = path.basename(template);
            const filename = (basename === 'index.html' ? path.join(
                BUILD_PATH,
                path.relative(SRC_PATH, template),
            ) : path.join(
                BUILD_PATH,
                path.relative(SRC_PATH, path.dirname(template)),
                path.basename(template, '.html'),
                'index.html',
            ));
            return new HtmlWebpackPlugin({
                filename,
                template,
                inject: true,
                minify: {
                    removeScriptTypeAttributes: true,
                    html5: true,
                    conservativeCollapse: false,
                    ...(APP.HTML_PRETTY ? {
                        collapseWhitespace: false,
                        removeComments: false,
                        decodeEntities: false,
                        minifyCSS: false,
                        minifyJS: false,
                    } : {
                        collapseWhitespace: true,
                        removeComments: true,
                        decodeEntities: true,
                        minifyCSS: true,
                        minifyJS: true,
                    }),
                },
                hash: true,
                cache: !PROD,
                title: APP.TITLE,
            });
        }) : []),
        ...(APP.USE_HTML && isModern ? [
            new HtmlWebpackModernBuildPlugin(),
            new SvgoPlugin({ enabled: PROD }),
        ] : []),
        ...(PROD && APP.USE_HTML && APP.HTML_PRETTY && isModern ? [new HtmlBeautifyPlugin()] : []),
        ...(isModern ? [] : [
            new CopyWebpackPlugin([
                ...[
                    '**/.htaccess',
                    'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                    'google*.html',
                    'yandex_*.html',
                    '*.txt',
                    'fonts/*',
                    'php/*.php',
                ].map((from) => ({
                    from,
                    to: BUILD_PATH,
                    context: SRC_PATH,
                    ignore: SITEMAP,
                })),
            ], {
                copyUnmodified: !PROD,
                debug: 'info',
            }),
        ]),
        ...(PROD ? [
            ...(!isModern ? [
                new ImageminPlugin({
                    test: /\.(jpeg|jpg|png|gif|svg)$/i,
                    exclude: /(fonts|font|upload)/i,
                    name: resourceName('img', false),
                    imageminOptions: require('./imagemin.config.js'),
                    cache: false,
                    loader: true,
                }),
            ] : []),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${isModern ? 'modern' : 'legacy'}-${NODE_ENV}.html`),
            }),
        ] : []),
        ...(PROD && APP.USE_COMPRESSION ? [
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: isModern ? /\.(js|css|html)$/ : /\.(js)$/,
            }),
            new CompressionPlugin({
                test: isModern ? /\.(css|js|html)(\?.*)?$/i : /\.(js)(\?.*)?$/i,
                filename: '[path].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
            }),
        ] : []),
        // this is always last
        ...(APP.USE_SERVICE_WORKER ? [new WorkboxPlugin.GenerateSW({
            cacheId: PACKAGE_NAME,
            swDest: SERVICE_WORKER_PATH,
            importWorkboxFrom: 'local',
            clientsClaim: true,
            skipWaiting: true,
            precacheManifestFilename: slash(path.join(SERVICE_WORKER_BASE, 'service-worker-precache.js?[manifestHash]')),
            globDirectory: slash(BUILD_PATH),
            globPatterns: [
                'js/**/*.min.js',
                'css/*.min.css',
                'fonts/*.woff2',
            ],
            globIgnores: [
                '*.map', '*.LICENSE',
            ],
            include: [],
            runtimeCaching: [{
                urlPattern: new RegExp(`${PUBLIC_PATH}(css|js|fonts)/`),
                handler: 'networkFirst',
                options: {
                    cacheName: `${PACKAGE_NAME}-assets`,
                    networkTimeoutSeconds: 10,
                },
            }, {
                urlPattern: /\//,
                handler: 'networkFirst',
                options: {
                    cacheName: `${PACKAGE_NAME}-html`,
                    networkTimeoutSeconds: 10,
                },
            }],
            ignoreUrlParametersMatching: [/^utm_/, /^[a-fA-F0-9]{32}$/],
        })] : []),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        alias: {
            '~': path.resolve(SRC_PATH, 'js'),
            ...(isModern ? {
                '@barba/core': path.resolve(__dirname, 'node_modules/@barba/core/dist/barba.mjs'),
            } : {}),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/i,
                loader: './loader.html.js',
                options: {
                    context: Object.assign(
                        {},
                        // HTML_DATA,
                        APP,
                        {
                            NODE_ENV,
                            PUBLIC_PATH,
                            ROOT_PATH,
                            SERVICE_WORKER_HASH,
                        },
                    ),
                    searchPath: SRC_PATH,
                },
            },
            // javascript loaders
            ...(USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.js$/i,
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(SRC_PATH, 'js', 'external'),
                ],
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    cache: !PROD,
                    quiet: PROD,
                    emitError: false,
                    emitWarning: false,
                },
            }] : []),
            {
                test: /\.jsx?$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
                },
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                'babel-plugin-transform-async-to-promises',
                                '@babel/transform-runtime',
                                '@babel/plugin-syntax-dynamic-import',
                            ],
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false,
                                    corejs: 3,
                                    useBuiltIns: 'usage',
                                    targets: isModern ? {
                                        esmodules: true,
                                    } : {
                                        browsers: browserslist.legacy,
                                    },
                                }],
                            ],
                            envName: NODE_ENV,
                        },
                    },
                ],
            },
            // GLSL
            // {
            //     test: /\.glsl$/i,
            //     loader: 'webpack-glsl-loader',
            // },
            // image loaders
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font)/i,
                oneOf: [
                    {
                        resourceQuery: /[&?]resize=.+/,
                        loader: './loader.resize.js',
                        options: { name: resourceName('img', false), limit: 32 * 1024 },
                    },
                    {
                        resourceQuery: /[&?]inline=inline/,
                        loader: 'url-loader',
                        options: { name: resourceName('img', false), limit: 32 * 1024 },
                    },
                    {
                        loader: 'file-loader',
                        options: { name: resourceName('img', false) },
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
                exclude: /(img|images)/i,
                loader: 'file-loader',
                options: {
                    name: resourceName('fonts', false),
                },
            },
            // css loaders
            {
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
                            config: { path: './postcss.config.js' },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: [
                                ['$NODE_ENV', NODE_ENV],
                            ].map((i) => ((k, v) => `${k}: ${JSON.stringify(v)};`)(...i)).join('\n'),
                            indentWidth: 4,
                            sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                            sourceMapEmbed: USE_SOURCE_MAP,
                            sourceComments: USE_SOURCE_MAP,
                        },
                    },
                ]),
            },
        ],
    },
    // Some libraries import Node modules but don't use them in the browser.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
