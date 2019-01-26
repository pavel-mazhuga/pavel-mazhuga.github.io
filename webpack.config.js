/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const webpack = require('webpack');
const slash = require('slash');
const path = require('path');
const glob = require('glob');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const zopfli = require('@gfx/zopfli');

const APP = require('./app.config.js');

const { BUILD_TYPE } = process.env;
const MODERN = BUILD_TYPE ? BUILD_TYPE === 'modern' : true;
const PROD = process.env.NODE_ENV === 'production';
const SANDBOX = process.env.ENV === 'sandbox';
const BITRIX = process.env.ENV === 'bitrix';
const NODE_ENV = PROD ? 'production' : 'development';
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const USE_SOURCE_MAP = DEV_SERVER;
const USE_LINTERS = PROD;

const configurePublicPath = () => {
    if (SANDBOX) return `/sand/${APP.PROJECT_NAME || 'xxx'}/dev/`;
    if (BITRIX) return '/local/templates/main/';
    return '/';
};

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');

const PUBLIC_PATH = configurePublicPath();
const ROOT_PATH = SANDBOX ? `/sand/${APP.PROJECT_NAME || 'xxx'}/dev/` : '/';

const { browserslist: BROWSERS } = require('./package.json');
const HTML_DATA = require('./src/app.data.js');
const SvgoPlugin = require('./plugin.svgo.js');
const HtmlWebpackModernBuildPlugin = require('./plugin.modern-build.js');
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
    const suffix = hash ? '?[hash]' : '';
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
            });
        },
        // TODO: test it
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/errors/404/' },
            ],
        },
    },

    entry: {
        app: `${SRC_PATH}/js/app.js`,
    },

    output: {
        filename: `js/${BUILD_TYPE}/[name].min.js`,
        chunkFilename: `js/${BUILD_TYPE}/[name].chunk.js`,
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
            filename: 'css/app.min.css?[hash:8]',
            allChunks: true,
        }),
        ...(PROD ? [
            ...(MODERN ? [new CleanWebpackPlugin(['build/**/*'], { root: __dirname })] : []),
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: true,
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
            ROOT_PATH: JSON.stringify(ROOT_PATH),
        }),
        ...(USE_LINTERS && MODERN ? [
            new StyleLintPlugin({
                syntax: 'scss',
                files: '**/*.scss',
                configFile: './.stylelintrc',
                ignorePath: './.stylelintignore',
                emitErrors: false,
                failOnError: false,
                lintDirtyModulesOnly: DEV_SERVER,
                fix: !DEV_SERVER,
            }),
        ] : []),
        ...(APP.USE_FAVICONS && MODERN ? [
            new FaviconsPlugin.AppIcon({
                logo: './.favicons-source-1024x1024.png',
                prefix: 'img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: './.favicons-source-64x64.png',
                prefix: 'img/favicon/',
            }),
        ] : []),
        ...(MODERN ? [
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
                        }),
                    },
                    hash: true,
                    cache: !(PROD),
                    title: APP.TITLE,
                });
            })),
            new HtmlWebpackModernBuildPlugin({ publicPath: PUBLIC_PATH }),
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
                copyUnmodified: !PROD,
                debug: 'info',
            }),
            new ImageminPlugin({
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font)/i,
                name: resourceName('img', true),
                imageminOptions: require('./imagemin.config.js'),
                cache: false,
                loader: true,
            }),
        ] : []),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${NODE_ENV}-${BUILD_TYPE}.html`),
        }),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        alias: {
            '~': path.join(SRC_PATH, 'js'),
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
                test: /\.js$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
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
                                    targets: {
                                        ...(MODERN ? {
                                            esmodules: true,
                                        } : {
                                            browsers: BROWSERS.legacy,
                                        }),
                                    },
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
