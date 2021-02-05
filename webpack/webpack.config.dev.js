const { merge } = require('webpack-merge');

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
            // bonjour: true,
            disableHostCheck: true,
            hot: true,
            writeToDisk: true,
            // quiet: true,
            host: 'localhost',
            port: 8080,
            overlay: { warnings: false, errors: true },
            before(app, server) {
                // app.get('/service-worker.js', (request, response) => response.sendFile(SERVICE_WORKER_PATH));
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

        plugins: [configureCleanWebpackPlugin(), ...configureHtmlWebpackPlugin(USE_HTML), configureBrowsersync()],

        performance: false,

        devtool: 'eval-source-map',
    }),
];
