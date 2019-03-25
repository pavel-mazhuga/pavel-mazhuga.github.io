/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const webpack = require('webpack');
const slash = require('slash');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const md5File = require('md5-file');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const WorkboxPlugin = require('workbox-webpack-plugin');

const APP = require('./app.config.js');

const PROD = process.env.NODE_ENV === 'production';
const SANDBOX = process.env.ENV === 'sandbox';
const BITRIX = process.env.ENV === 'bitrix';
const NODE_ENV = PROD ? 'production' : 'development';
const WATCH = process.argv.indexOf('--watch') !== -1 || process.argv.indexOf('-w') !== -1;
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const USE_LINTERS = PROD;

const configurePublicPath = () => {
    if (SANDBOX) return APP.PUBLIC_PATH_SANDBOX;
    if (BITRIX) return APP.PUBLIC_PATH_SANDBOX;
    return APP.PUBLIC_PATH;
};

const { SRC_PATH, BUILD_PATH } = APP;
const PUBLIC_PATH = configurePublicPath();
const ROOT_PATH = SANDBOX ? APP.PUBLIC_PATH_SANDBOX : '/';

const { browserslist, name: PACKAGE_NAME } = require('./package.json');
const HTML_DATA = require('./src/app.data.js');
const SvgoPlugin = require('./plugin.svgo.js');
const BrotliPlugin = (PROD ? require('brotli-webpack-plugin') : () => {});
const CompressionPlugin = (PROD ? require('compression-webpack-plugin') : () => {});
const StyleLintPlugin = (USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});

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
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].min.js?[contenthash:8]',
        path: BUILD_PATH,
        publicPath: PUBLIC_PATH,
    },

    optimization: {
        // splitChunks: {
        //     cacheGroups: {
        //         vendor: {
        //             test: /node_modules/,
        //             chunks: 'initial',
        //             name: 'vendor',
        //             enforce: true,
        //         },
        //     },
        // },
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
        ...(WATCH ? [new BrowserSyncPlugin()] : []),
        new CleanWebpackPlugin(),
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
        //     cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
        // }),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css?[contenthash:8]',
            allChunks: true,
        }),
        ...(PROD ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            ...(APP.USE_COMPRESSION ? [
                new BrotliPlugin({
                    asset: '[path].br[query]',
                    test: /\.(js|css)$/,
                }),
                new CompressionPlugin({
                    test: /\.(css|js)(\?.*)?$/i,
                    filename: '[path].gz[query]',
                    compressionOptions: {
                        numiterations: 15,
                    },
                    algorithm(input, compressionOptions, callback) {
                        return zopfli.gzip(input, compressionOptions, callback);
                    },
                }),
            ] : []),
        ] : []),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            ENV: JSON.stringify(process.env.ENV),
            PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
            ROOT_PATH: JSON.stringify(ROOT_PATH),
            SENTRY_DSN: JSON.stringify(APP.SENTRY_DSN),
        }),
        ...(USE_LINTERS ? [
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
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: path.join(__dirname, '.favicons-source-1024x1024.png'),
                prefix: 'img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                prefix: 'img/favicon/',
            }),
        ] : []),
        ...(APP.USE_HTML ? SITEMAP.map((template) => {
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
        ...(APP.USE_HTML ? new SvgoPlugin({ enabled: PROD }) : []),
        ...(PROD && APP.USE_HTML && APP.HTML_PRETTY ? [new HtmlBeautifyPlugin()] : []),
        new CopyWebpackPlugin([
            ...[
                '**/.htaccess',
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                'google*.html',
                'yandex_*.html',
                '*.txt',
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
        ...(PROD ? [
            new ImageminPlugin({
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font)/i,
                name: resourceName('img', true),
                imageminOptions: require('./imagemin.config.js'),
                cache: false,
                loader: true,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${NODE_ENV}.html`),
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
                'js/*.min.js',
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
                        HTML_DATA,
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
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery',
                }, {
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
            ...(USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.js$/i,
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(SRC_PATH, 'js', 'external'),
                ],
                loader: 'eslint-loader',
                options: {
                    fix: false,
                    cache: !PROD,
                    quiet: PROD,
                    emitError: false,
                    emitWarning: false,
                },
            }] : []),
            {
                test: /\.js$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
                },
                loaders: [
                    {
                        loader: 'imports-loader',
                        options: {
                            $: 'jquery',
                            jQuery: 'jquery',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/transform-runtime',
                                '@babel/plugin-syntax-dynamic-import',
                            ],
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false,
                                    loose: true,
                                    useBuiltIns: 'usage',
                                    targets: {
                                        browsers: browserslist.legacy,
                                    },
                                    // exclude: ['es6.promise'],
                                }],
                            ],
                            envName: NODE_ENV,
                        },
                    },
                ],
            },
            // image loaders
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font)/i,
                oneOf: [
                    {
                        resourceQuery: /[&?]resize=.+/,
                        loader: './loader.resize.js',
                        options: { name: resourceName('img', true), limit: 32 * 1024 },
                    },
                    {
                        resourceQuery: /[&?]inline=inline/,
                        loader: 'url-loader',
                        options: { name: resourceName('img', true), limit: 32 * 1024 },
                    },
                    {
                        loader: 'file-loader',
                        options: { name: resourceName('img', true) },
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
                exclude: /(img|images)/i,
                loader: 'file-loader',
                options: {
                    name: resourceName('fonts', true),
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
