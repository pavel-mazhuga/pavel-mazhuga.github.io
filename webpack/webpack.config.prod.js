const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackModernBuildPlugin = require('./plugins/plugin.modern-build');
const SvgoPlugin = require('./plugins/plugin.svgo.js');
const { USE_COMPRESSION, USE_HTML, HTML_PRETTY } = require('../webpack.settings');
const { resourceName } = require('./utils');
const {
    configureHtmlWebpackPlugin,
    legacyConfig,
    modernConfig,
    // LEGACY_TYPE,
    MODERN_TYPE,
} = require('./webpack.config.common');

const configureBundleReportName = (buildType) => `bundle-analyzer-${buildType}-production.html`;

const configureCompression = (useCompression, buildType) => {
    if (useCompression) {
        return [
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: buildType === MODERN_TYPE ? /\.(js|css|html)$/ : /\.(js)$/,
            }),
            new CompressionPlugin({
                test: buildType === MODERN_TYPE ? /\.(css|js|html)(\?.*)?$/i : /\.(js)(\?.*)?$/i,
                filename: '[path].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
            }),
        ];
    }

    return [];
};

const configureHtmlBeautifyPlugin = (useHtml, prettyHtml) => (useHtml && prettyHtml ? [new HtmlBeautifyPlugin()] : []);

const configureHtmlModernBuildPlugin = (useHtml) => (useHtml ? [new HtmlWebpackModernBuildPlugin()] : []);

const baseConfig = {
    mode: 'production',

    devtool: 'source-map',

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: true,
                cache: true,
            }),
        ],
    },

    performance: {
        assetFilter: (asset) => {
            const [filename] = asset.split('?', 2);
            const ignore = /(\.(css|js)\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize-.+)$/;
            return !ignore.test(filename);
        },
        hints: 'warning',
        maxAssetSize: 3 * 1024 * 1024, // 3 MB
        maxEntrypointSize: 512 * 1024, // 512 KB
    },

    plugins: [
        new CaseSensitivePathsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: path.join(__dirname, '../', 'node_modules', '.cache', configureBundleReportName('modern')),
        }),
        ...configureCompression(USE_COMPRESSION),
    ],
};

module.exports = [
    merge(legacyConfig, baseConfig, {
        plugins: [
            new ImageminPlugin({
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font|upload)/i,
                name: resourceName('img'),
                // eslint-disable-next-line global-require
                imageminOptions: require('./imagemin.config.js'),
                cache: false,
                loader: true,
            }),
        ],
    }),

    merge(modernConfig, baseConfig, {
        plugins: [
            ...configureHtmlWebpackPlugin(USE_HTML),
            new SvgoPlugin({ enabled: true }),
            ...configureHtmlModernBuildPlugin(USE_HTML),
            ...configureHtmlBeautifyPlugin(USE_HTML, HTML_PRETTY),
        ],
    }),
];