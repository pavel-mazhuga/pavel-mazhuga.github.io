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
    USE_COMPRESSION: true,
    USE_SERVICE_WORKER: false,
    SENTRY_DSN: '',
    // путь до корня всего проекта (нужен для HMR)
    PROJECT_ROOT_PATH_DEFAULT: '',
    PROJECT_ROOT_PATH_SANDBOX: '',
    // PROJECT_ROOT_PATH_SANDBOX: '../../../../../',
    PROJECT_ROOT_PATH_BITRIX: '../../../../../',
    // куда положить собранный вебпаком html
    HTML_PATH_DEFAULT: '',
    HTML_PATH_SANDBOX: '',
    // HTML_PATH_SANDBOX: '../../../../../html/',
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
