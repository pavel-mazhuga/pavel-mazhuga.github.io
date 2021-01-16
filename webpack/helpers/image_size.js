const path = require('path');
const ImageSize = require('image-size');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'src', filename);
    return ImageSize(fullpath);
};
