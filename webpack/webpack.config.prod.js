const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlBeautifyPlugin = require('./plugins/plugin.html-beautify');
const CompressionPlugin = require('compression-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackModernBuildPlugin = require('./plugins/plugin.modern-build');
const { USE_COMPRESSION, USE_HTML, HTML_PRETTY } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    // configureCopyPlugin,
    configureCleanWebpackPlugin,
    legacyConfig,
    modernConfig,
    MODERN_TYPE,
} = require('./webpack.config.common');

const { BUILD_TYPE } = process.env;

const configureCompression = (useCompression) => {
    if (useCompression) {
        const regex = /\.(css|js|svg|wasm|json)(\?.*)?$/i;

        return [
            new CompressionPlugin({
                test: regex,
                filename: '[path][base].br[query]',
                compressionOptions: {
                    level: 11,
                },
                algorithm: 'brotliCompress',
                cache: path.join(__dirname, 'node_modules', '.cache', `compression-webpack-plugin-br`),
            }),
            new CompressionPlugin({
                test: regex,
                filename: '[path][base].gz[query]',
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
        minimizer: [new TerserPlugin()],
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
        ? merge(baseConfig, modernConfig, {
              plugins: [
                  ...configureHtmlWebpackPlugin(USE_HTML),
                  ...configureHtmlModernBuildPlugin(USE_HTML),
                  ...configureHtmlBeautifyPlugin(USE_HTML, HTML_PRETTY),
                  //   configureCopyPlugin(),
                  new BundleAnalyzerPlugin(configureBundleAnalyzerPlugin('modern')),
              ],
          })
        : merge(baseConfig, legacyConfig, {
              plugins: [
                  configureCleanWebpackPlugin(),
                  new BundleAnalyzerPlugin(configureBundleAnalyzerPlugin('legacy')),
              ],
          });
