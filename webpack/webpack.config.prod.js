const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackModernBuildPlugin = require('./plugins/plugin.modern-build');
const { USE_COMPRESSION, USE_HTML, HTML_PRETTY } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    configureCopyPlugin,
    configureCleanWebpackPlugin,
    legacyConfig,
    modernConfig,
    MODERN_TYPE,
} = require('./webpack.config.common');

const { BUILD_TYPE } = process.env;

const configureCompression = (useCompression, buildType) => {
    if (useCompression) {
        return [
            new CompressionPlugin({
                test: buildType === MODERN_TYPE ? /\.(css|js|html|json)(\?.*)?$/i : /\.(js)(\?.*)?$/i,
                filename: '[path].br[query]',
                compressionOptions: {
                    level: 11,
                },
                algorithm: 'brotliCompress',
                cache: path.join(__dirname, 'node_modules', '.cache', `compression-webpack-plugin-br`),
            }),
            new CompressionPlugin({
                test: buildType === MODERN_TYPE ? /\.(css|js|html|json)(\?.*)?$/i : /\.(js)(\?.*)?$/i,
                filename: '[path].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
                cache: path.join(__dirname, 'node_modules', '.cache', `compression-webpack-plugin-gz`),
            }),
        ];
    }

    return [];
};

const configureHtmlBeautifyPlugin = (useHtml, prettyHtml) => (useHtml && prettyHtml ? [new HtmlBeautifyPlugin()] : []);

const configureHtmlModernBuildPlugin = (useHtml) => (useHtml ? [new HtmlWebpackModernBuildPlugin()] : []);

const configureBundleAnalyzerPlugin = (buildType) => ({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: path.join(
        __dirname,
        '../',
        'node_modules',
        '.cache',
        `bundle-analyzer-${buildType}-production.html`,
    ),
});

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
        ...configureCompression(USE_COMPRESSION),
    ],
};

module.exports =
    BUILD_TYPE === MODERN_TYPE
        ? merge(modernConfig, baseConfig, {
              plugins: [
                  ...configureHtmlWebpackPlugin(USE_HTML),
                  ...configureHtmlModernBuildPlugin(USE_HTML),
                  ...configureHtmlBeautifyPlugin(USE_HTML, HTML_PRETTY),
                  configureCopyPlugin(),
                  new BundleAnalyzerPlugin(configureBundleAnalyzerPlugin('modern')),
              ],
          })
        : merge(legacyConfig, baseConfig, {
              plugins: [
                  configureCleanWebpackPlugin(),
                  new BundleAnalyzerPlugin(configureBundleAnalyzerPlugin('legacy')),
              ],
          });
