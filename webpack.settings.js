const path = require('path');

const { name } = require('./package.json');

module.exports = {
    LANGUAGE: 'ru',
    TITLE: '[YOUR_SITE_NAME]',
    DESCRIPTION: '[DESCRIPTION]',
    THEME_COLOR: '#fff',
    BACKGROUND_COLOR: '#fff',
    USE_HTML: true,
    HTML_PRETTY: true,
    USE_FAVICONS: false,
    USE_COMPRESSION: false,
    USE_SERVICE_WORKER: false,
    SENTRY_DSN: '',
    PUBLIC_PATH_DEFAULT: '/',
    PUBLIC_PATH_BITRIX: '/local/templates/main/frontend/build/',
    PUBLIC_PATH_SANDBOX: `/${name}/`,
    SRC_PATH: path.resolve(__dirname, 'src'),
    BUILD_PATH: path.resolve(__dirname, 'build'),
};
