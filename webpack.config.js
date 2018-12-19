/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const PROD = process.env.NODE_ENV === 'production';
const SANDBOX = process.env.ENV === 'sandbox';
const BITRIX = process.env.ENV === 'bitrix';
const NODE_ENV = PROD ? 'production' : 'development';

const { browserslist: BROWSERS } = require('./package.json');
const APP = require('./app.config.js');
const HTML_DATA = require('./src/app.data.js');

const webpack = require('webpack');
const slash = require('slash');
const path = require('path');
const glob = require('glob');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrotliPlugin = (PROD ? require('brotli-webpack-plugin') : () => {});
const CompressionPlugin = (PROD ? require('compression-webpack-plugin') : () => {});
const zopfli = require('@gfx/zopfli');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = (PROD ? require('uglifyjs-webpack-plugin') : () => {});
const SvgoPlugin = require('./plugin.svgo.js');
const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});

const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const USE_LINTERS = PROD;

const SRC_PATH = path.resolve(__dirname, 'src');

const BUILD_PATH =
    SANDBOX
        ? path.resolve(__dirname, 'dist/sandbox')           // sandbox
        : BITRIX
            ? path.resolve(__dirname, 'dist/bitrix')        // bitrix
            : path.resolve(__dirname, 'build');             // default

const PUBLIC_PATH =
    SANDBOX
        ? `/sand/${APP.PROJECT_NAME || 'xxx'}/dev/`         // sandbox
        : BITRIX
            ? '/local/templates/main/'                      // bitrix
            : APP.PUBLIC_PATH;                              // default

const SITEMAP = glob.sync(`${slash(SRC_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SRC_PATH)}/partials/**/*.html`,
        `${slash(SRC_PATH)}/google*.html`,
        `${slash(SRC_PATH)}/yandex_*.html`,
    ],
});

const resourceName = (prefix, hash = false) => {
    const basename = path.basename('assets/', prefix);
    const suffix = hash ? '?[hash]' : '';
    return (resourcePath) => {
        const url = slash(path.relative(SRC_PATH, resourcePath));
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
            // Имитация отправки форм через webpack-dev-server
            const bodyParser = require('body-parser');    
            app.use(bodyParser.json());

            const data = {
                success: true,
                message: 'Это тестовое сообщение с сервера',
                html: '<div>Это тестовый HTML с сервера</div>',
            };

            app.get('/api', (req, res) => {
                res.send(data);
            });

            app.post('/api', bodyParser.json(), (req, res) => {
                res.send(data);
            })
        },
        // TODO: test it
        // historyApiFallback: {
        //     rewrites: [
        //         // { from: /^\/$/, to: '/views/landing.html' },
        //         // { from: /^\/subpage/, to: '/views/subpage.html' },
        //         { from: /./, to: '/errors/404/' },
        //     ],
        // },
    },

    entry: {
        app: `${SRC_PATH}/assets/js/app.ts`,
    },

    output: {
        filename: 'assets/js/app.min.js?[hash:8]',
        chunkFilename: 'assets/js/[name].chunk.js?[hash:8]',
        path: BUILD_PATH,
        publicPath: PUBLIC_PATH,
    },

    performance: (PROD ? {
        assetFilter: (asset) => {
            const [filename] = asset.split('?', 2);
            const ignore = /(\.(css|js)\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize-.+)$/;
            return !(ignore.test(filename));
        },
        hints: 'warning',
        maxAssetSize: 3 * 1024 * 1024, // 3MB
        maxEntrypointSize: 512 * 1024, // 512KB
    } : false),

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'assets/css/app.min.css?[hash:8]',
            allChunks: true,
        }),
        ...(PROD ? [
            new CleanWebpackPlugin([
                ...(SANDBOX
                    ? ['dist/sandbox/**/*']
                    : BITRIX
                        ? ['dist/bitrix/**/*']
                        : ['build/**/*']),
            ], {
                root: __dirname,
            }),
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: true,
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
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
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            ENV: JSON.stringify(process.env.ENV),
            PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
        }),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: './.favicons-source-1024x1024.png',
                prefix: 'assets/img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: './.favicons-source-64x64.png',
                prefix: 'assets/img/favicon/',
            }),
        ] : []),
        ...(SITEMAP.map((template) => {
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
                    })
                },
                hash: true,
                cache: !(PROD),
                title: APP.TITLE,
            });
        })),
        new SvgoPlugin({ enabled: PROD }),
        new CopyWebpackPlugin([
            ...[
                '**/.htaccess',
                'assets/img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                'google*.html',
                'yandex_*.html',
                '*.txt',
                '*.php',
            ].map(from => ({
                from,
                to: BUILD_PATH,
                context: SRC_PATH,
                ignore: SITEMAP,
            })),
        ], {
            copyUnmodified: !PROD,
            debug: 'info',
        }),
        new BundleAnalyzerPlugin({
            // analyzerMode: DEV_SERVER ? 'server' : 'static',
            analyzerMode: 'static',
            // openAnalyzer: DEV_SERVER,
            openAnalyzer: false,
            reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${NODE_ENV}.html`),
        }),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        alias: {
            '~': path.join(SRC_PATH, 'js'),
        },
        extensions: ['.js', '.ts'],
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
                test: /\.tsx?$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                        },
                    },
                ],
            },
            {
                test: /\.js$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
                    // exclude: path.join(__dirname, 'node_modules', 'gsap'),
                },
                loaders: [
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
                                    useBuiltIns: 'usage',
                                    loose: true,
                                    targets: { browsers: BROWSERS },
                                    // exclude: [
                                    //     "transform-async-to-generator",
                                    //     "transform-generator",
                                    // ]
                                }],
                                ['airbnb', {
                                    modules: true,
                                    targets: { browsers: BROWSERS },
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
                            ].map(i => ((k, v) => `${k}: ${JSON.stringify(v)};`)(...i)).join('\n'),
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
