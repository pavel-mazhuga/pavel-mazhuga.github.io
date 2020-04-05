const merge = require('webpack-merge');

const { USE_HTML } = require('../webpack.settings');
const {
    configureHtmlWebpackPlugin,
    configureCopyPlugin,
    configureCleanWebpackPlugin,
    modernConfig,
    SERVICE_WORKER_PATH,
    configureBrowsersync,
} = require('./webpack.config.common');

const BROWSERSYNC = process.argv.indexOf('--browsersync') !== -1;

module.exports = [
    merge(modernConfig, {
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

        plugins: [
            configureCleanWebpackPlugin(),
            ...configureHtmlWebpackPlugin(USE_HTML),
            configureCopyPlugin(),
            ...(BROWSERSYNC ? [configureBrowsersync()] : []),
        ],

        performance: false,

        devtool: 'eval-source-map',
    }),
];
