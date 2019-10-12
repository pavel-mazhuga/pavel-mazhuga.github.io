const deepMerge = require('lodash.merge');
const ImageSize = require('image-size');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const APP = require('../../webpack.settings.js');

const DEFAULT_FAVICON = {
    logo: './.favicons-source-64x64.png',
    prefix: 'img/favicon/',
    appName: APP.TITLE,
    appDescription: APP.DESCRIPTION,
    background: APP.BACKGROUND_COLOR,
    theme_color: APP.THEME_COLOR,
    favicons: {
        icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: false,
            twitter: false,
            yandex: false,
            windows: false,
        },
    },
};

module.exports.FavIcon = function FavIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_FAVICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`FavIcon '${mergedOptions.logo}': the file is not a valid image`);
    } else if (!(logoSize.width === 64 && logoSize.height === 64)) {
        throw new Error(`FavIcon '${mergedOptions.logo}': image size does not match (64 x 64)`);
    }
    return new WebappWebpackPlugin(mergedOptions);
};

const DEFAULT_APPICON = {
    logo: './.favicons-source-1024x1024.png',
    prefix: 'img/favicon/',
    appName: APP.TITLE,
    appDescription: APP.DESCRIPTION,
    background: APP.BACKGROUND_COLOR,
    theme_color: APP.THEME_COLOR,
    favicons: {
        icons: {
            android: true,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: false,
            firefox: false,
            opengraph: false,
            twitter: false,
            yandex: false,
            windows: false,
        },
    },
};

module.exports.AppIcon = function AppIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_APPICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`AppIcon '${mergedOptions.logo}': the file is not a valid image`);
    } else if (!(logoSize.width === 1024 && logoSize.height === 1024)) {
        throw new Error(`AppIcon '${mergedOptions.logo}': image size does not match (1024 x 1024)`);
    }
    return new WebappWebpackPlugin(mergedOptions);
};
