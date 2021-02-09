const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');

const { USE_HTML } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    configureCleanWebpackPlugin,
    modernConfig,
    // SERVICE_WORKER_PATH,
    configureBrowsersync,
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
            port: 8080,
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
            proxy: process.env.HOST
                ? {
                      '*': {
                          target: process.env.HOST,
                          changeOrigin: true,
                      },
                  }
                : {},
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
