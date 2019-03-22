/* eslint max-len: "off" */
const path = require('path');

module.exports = {
    LANGUAGE: 'ru',
    TITLE: '[YOUR_SITE_NAME]',
    DESCRIPTION: '[DESCRIPTION]',
    THEME_COLOR: '#fff',
    BACKGROUND_COLOR: '#fff',
    HTML_PRETTY: true,
    USE_FAVICONS: true,
    USE_COMPRESSION: false,
    USE_SERVICE_WORKER: false,
    SENTRY_DSN: '',
    PUBLIC_PATH: '/',
    PUBLIC_PATH_BITRIX: '/local/templates/main/',
    PUBLIC_PATH_SANDBOX: '/sand/[PROJECT_NAME]/dev/',
    SRC_PATH: path.resolve(__dirname, 'src'),
    BUILD_PATH: path.resolve(__dirname, 'build'),
};
