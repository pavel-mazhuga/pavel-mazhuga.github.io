const path = require('path');

const { name } = require('./package.json');

module.exports = {
    LANGUAGE: 'ru',
    TITLE: '[YOUR_SITE_NAME]',
    DESCRIPTION: '[DESCRIPTION]',
    THEME_COLOR: '#fff',
    BACKGROUND_COLOR: '#fff',
    USE_HTML: true,
    USE_FAVICONS: false,
    USE_COMPRESSION: true,
    USE_SERVICE_WORKER: false,
    HTML_PRETTY: true,
    SENTRY_DSN: '',
    // куда положить собранный вебпаком html
    HTML_PATH_BITRIX: '../../../../../html/',
    ROOT_PATH_DEFAULT: '/',
    ROOT_PATH_SANDBOX: `/${name}/html/`,
    ROOT_PATH_BITRIX: '/html/',
    // куда положить собранные вебпаком ассеты
    PUBLIC_PATH_DEFAULT: '/',
    PUBLIC_PATH_BITRIX: '/local/templates/main/frontend/build/',
    PUBLIC_PATH_SANDBOX: `/${name}/local/templates/main/frontend/build/`,
    SRC_PATH: path.resolve(__dirname, 'src'),
    BUILD_PATH: path.resolve(__dirname, 'build'),
};
