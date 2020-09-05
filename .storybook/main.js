const path = require('path');
const { URLSearchParams } = require('url');
const sortCSSmq = require('sort-css-media-queries');

const { browserslist } = require('../package.json');

const INLINE_FILES = ['png', 'jpeg', 'jpg', 'gif', 'svg'];

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.(css|scss)$/i,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('postcss-devtools')({ precise: true }),
                            require('postcss-input-style')(),
                            require('postcss-responsive-type')(),
                            require('postcss-easings')(),
                            require('postcss-focus-visible')(),
                            require('postcss-focus-within')(),
                            ...(configType === 'PRODUCTION'
                                ? [
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
                                              const format =
                                                  params.get('format') || path.extname(asset.pathname).substr(1);
                                              if (INLINE_FILES.includes(format.toLowerCase())) {
                                                  params.set('inline', 'inline');
                                              }
                                              return `${asset.pathname}?${params.toString()}`;
                                          },
                                      }),
                                      require('postcss-custom-properties')(),
                                      require('postcss-font-display')({ display: 'swap' }),
                                      require('postcss-object-fit-images')(),
                                      require('postcss-flexbugs-fixes')(),
                                      require('css-mqpacker')({ sort: sortCSSmq.desktopFirst }),
                                      require('autoprefixer')({ browsers: browserslist.browsers }),
                                      // this is always last
                                      require('cssnano')({
                                          preset: [
                                              'default',
                                              {
                                                  discardComments: { removeAll: true },
                                              },
                                          ],
                                      }),
                                  ]
                                : []),
                            require('postcss-browser-reporter')(),
                            require('postcss-reporter')(),
                        ],
                    },
                },
                'sass-loader',
            ],
        });

        return config;
    },
};
