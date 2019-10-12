const slash = require('slash');
const path = require('path');

const { SRC_PATH } = require('../webpack.settings');

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = hash ? '?[contenthash:8]' : '';
    return (resourcePath) => {
        const url = slash(path.relative(SRC_PATH, resourcePath));
        if (url.startsWith('../')) {
            return url.replace(/\.\.\//g, '') + suffix;
        }
        if (url.startsWith(`${basename}/`)) {
            return url + suffix;
        }
        if (url.startsWith('../node_modules/')) {
            const [, , modulename] = url.split('/', 3);
            return slash(path.join(basename, modulename, `[name].[ext]${suffix}`));
        }
        return slash(path.join(basename, `[name].[ext]${suffix}`));
    };
};

module.exports = { resourceName };
