const merge = require('webpack-merge');

const { USE_HTML } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    configureCopyPlugin,
    legacyConfig,
    SERVICE_WORKER_PATH,
    USE_SOURCE_MAP,
} = require('./webpack.config.common');

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

        plugins: [...configureHtmlWebpackPlugin(USE_HTML), configureCopyPlugin()],

        performance: false,

        devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',
    }),
];
