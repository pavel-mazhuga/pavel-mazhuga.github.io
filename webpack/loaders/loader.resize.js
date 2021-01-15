const sharp = require('sharp');
const path = require('path');
const md5File = require('md5-file');
const flatCache = require('flat-cache');
const loaderUtils = require('loader-utils');
const urlLoader = require('url-loader');
const fileLoader = require('file-loader');
const weblog = require('webpack-log');

const logger = weblog({ name: 'loader-resize' });

const resizeCache = flatCache.load('loader-resize.json', path.resolve('./node_modules/.cache/'));

module.exports.resizeCache = resizeCache;

module.exports = function ResizeLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = this.async();
    const query = loaderContext.resourceQuery ? loaderUtils.parseQuery(loaderContext.resourceQuery) : {};
    const nextLoader = query.inline === 'inline' ? urlLoader : fileLoader;

    if (!('resize' in query)) {
        return loaderCallback(null, nextLoader.call(loaderContext, content));
    }

    if ('inline' in query) {
        delete query.inline;
    }

    const resourceInfo = path.parse(loaderContext.resourcePath);
    const relativePath = path.relative(__dirname, loaderContext.resourcePath);

    const resourceHash = md5File.sync(loaderContext.resourcePath);
    const cacheKey = `${relativePath}?${JSON.stringify(query)}&${resourceHash}`;
    let [, resizeWidth, , resizeHeight, resizeFlag] = query.resize.trim().match(/^(\d*)(x(\d*))?([!><^])?$/);
    resizeWidth = parseInt(resizeWidth, 10);
    resizeHeight = parseInt(resizeHeight, 10);
    resizeFlag = (resizeFlag || '').trim();
    const resizeFlagNames = {
        '': '',
        '!': '-ignore-aspect',
        '>': '-shrink-larger',
        '<': '-enlarge-smaller',
        '^': '-fill-area',
    };
    if (!(resizeFlag in resizeFlagNames)) {
        return loaderCallback(`Unknown resize flag: '${query.resize}'`);
    }

    const sourceFormat = resourceInfo.ext.substr(1).toLowerCase();
    const format = query.format?.toLowerCase() || sourceFormat;
    const name =
        (query.name ||
            `${resourceInfo.name}@resize-${resizeWidth || ''}x${resizeHeight || ''}${resizeFlagNames[resizeFlag]}`) +
        (query.suffix ? `-${query.suffix}` : '');

    const cacheData = resizeCache.getKey(cacheKey);
    if (cacheData !== undefined && cacheData.type === 'Buffer' && cacheData.data) {
        logger.info(`load cache '${relativePath}${loaderContext.resourceQuery}'`);
        loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
        loaderCallback(null, nextLoader.call(loaderContext, Buffer.from(cacheData.data)));
    } else {
        const quality = query.quality ? parseInt(query.quality, 10) : 90;
        sharp(content)
            .resize({
                width: resizeWidth,
                ...[resizeHeight && { height: resizeHeight }],
            })
            .toFormat(format, { quality })
            .toBuffer()
            .then((data) => {
                logger.info(`save cache '${relativePath}${loaderContext.resourceQuery}'`);
                resizeCache.setKey(cacheKey, data.toJSON());
                loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                loaderCallback(null, nextLoader.call(loaderContext, data));
                resizeCache.save(true);
            })
            .catch((err) => loaderCallback(err));
    }
};

module.exports.raw = true;
