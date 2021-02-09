const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');

const { USE_HTML, BUILD_PATH } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    configureCleanWebpackPlugin,
    modernConfig,
    configureBrowsersync,
    PROJECT_ROOT_PATH,
} = require('./webpack.config.common');

module.exports = [
    merge(modernConfig, {
        mode: 'development',

        watchOptions: {
            ignored: /node_modules/,
        },

        devServer: {
            compress: false,
            disableHostCheck: true,
            hot: true,
            writeToDisk: true,
            host: 'localhost',
            port: 8081,
            contentBase: path.resolve(__dirname, BUILD_PATH, PROJECT_ROOT_PATH),
            overlay: { warnings: false, errors: true },
            before(app, server, compiler) {
                const watchFiles = ['.html', '.hbs', '.njk'];

                compiler.plugin('done', () => {
                    const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

                    if (this.hot && changedFiles.some((filePath) => watchFiles.includes(path.parse(filePath).ext))) {
                        server.sockWrite(server.sockets, 'content-changed');
                    }
                });
            },
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            configureCleanWebpackPlugin(),
            ...configureHtmlWebpackPlugin(USE_HTML),
            configureBrowsersync(),
        ],

        performance: false,

        devtool: 'eval-source-map',
    }),
];
