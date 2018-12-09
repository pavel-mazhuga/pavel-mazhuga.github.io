/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';

const { browserslist: BROWSERS } = require('./package.json');
const APP = require('./app.config.js');
const HTML_DATA = require('./src/app.data.js');

const webpack = require('webpack');
// const fs = require('fs');
const slash = require('slash');
const path = require('path');
const glob = require('glob');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = (PROD ? require('uglifyjs-webpack-plugin') : () => {});
const SvgoPlugin = require('./plugin.svgo.js');
const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});

const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const USE_LINTERS = PROD;

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');

const SITEMAP = glob.sync(`${slash(SRC_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SRC_PATH)}/partials/**/*.html`,
        `${slash(SRC_PATH)}/google*.html`,
        `${slash(SRC_PATH)}/yandex_*.html`,
    ],
});

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[hash]' : '');
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
        overlay: { warnings: false, errors: true },
        before(app) {
            // Отправка форм через webpack-dev-server
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
        }
    },

    entry: {
        app: `${SRC_PATH}/js/app.ts`,
    },

    output: {
        filename: 'js/app.min.js',
        chunkFilename: 'js/[name].chunk.js',
        path: BUILD_PATH,
        publicPath: APP.PUBLIC_PATH,
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        ...(PROD ? [
            new CleanWebpackPlugin([
                'build/**/*',
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
        ] : []),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
        }),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: './.favicons-source-1024x1024.png',
                prefix: 'img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: './.favicons-source-64x64.png',
                prefix: 'img/favicon/',
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
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
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
            copyUnmodified: !(PROD),
            debug: 'info',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: (DEV_SERVER ? 'server' : 'static'),
            openAnalyzer: DEV_SERVER,
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
                        },
                    ),
                    searchPath: SRC_PATH,
                },
            },
            // javascript loaders
            // {
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery',
            //     }, {
            //         loader: 'expose-loader',
            //         options: '$',
            //     }],
            // },
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
                test: /\.js$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
                    // exclude: path.join(__dirname, 'node_modules', 'gsap'),
                },
                loaders: [
                    // {
                    //     loader: 'imports-loader',
                    //     options: {
                    //         $: 'jquery',
                    //         jQuery: 'jquery',
                    //     },
                    // },
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/transform-runtime',
                                '@babel/plugin-syntax-dynamic-import',
                            ],
                            presets: [
                                ['@babel/preset-env', {
                                    // modules: 'commonjs',
                                    modules: false,
                                    useBuiltIns: 'entry',
                                    targets: { browsers: BROWSERS },
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
