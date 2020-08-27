/* eslint global-require: "off" */
const path = require('path');
const { URLSearchParams } = require('url');
const sortCSSmq = require('sort-css-media-queries');

const { browserslist } = require('../package.json');

const PROD = (process.env.NODE_ENV === 'production');
const INLINE_FILES = ['png', 'jpeg', 'jpg', 'gif', 'svg'];

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-responsive-type')(),
        require('postcss-easings')(),
        require('postcss-focus-visible')(),
        require('postcss-focus-within')(),
        ...(PROD ? [
            require('postcss-image-set-polyfill')(),
            require('postcss-url')({
                filter(asset) {
                    if (!asset.pathname) return false;
                    if (/[&?]inline=/.test(asset.search)) return false;
                    const format = path.extname(asset.pathname).substr(1);
                    return INLINE_FILES.includes(format.toLowerCase());
                },
                url(asset) {
                    const params = new URLSearchParams(asset.search);
                    const format = params.get('format') || path.extname(asset.pathname).substr(1);
                    if (INLINE_FILES.includes(format.toLowerCase())) {
                        params.set('inline', 'inline');
                    }
                    return `${asset.pathname}?${params.toString()}`;
                },
            }),
            require('postcss-custom-properties')(),
            require('postcss-font-display')({ display: 'swap' }),
            // require('postcss-object-fit-images')(),
            require('postcss-flexbugs-fixes')(),
            // require('postcss-will-change')(),
            require('css-mqpacker')({ sort: sortCSSmq.desktopFirst }),
            require('autoprefixer')({ browsers: browserslist.browsers }),
            // this is always last
            require('cssnano')({
                preset: ['default', {
                    discardComments: { removeAll: true },
                }],
            }),
        ] : []),
        require('postcss-browser-reporter')(),
        require('postcss-reporter')(),
    ],
};
