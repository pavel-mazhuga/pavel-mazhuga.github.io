const merge = require('webpack-merge');

const { USE_HTML } = require('../webpack.settings');
const { configureHtmlWebpackPlugin, legacyConfig, SERVICE_WORKER_PATH } = require('./webpack.config.common');

module.exports = [
    merge(legacyConfig, {
        mode: 'development',

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

        plugins: [...configureHtmlWebpackPlugin(USE_HTML)],

        performance: false,
    }),
];
