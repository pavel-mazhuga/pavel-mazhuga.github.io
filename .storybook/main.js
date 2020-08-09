const path = require('path');
const { URLSearchParams } = require('url');
const sortCSSmq = require('sort-css-media-queries');

const { browserslist } = require('../package.json');

const INLINE_FILES = ['png', 'jpeg', 'jpg', 'gif', 'svg'];

module.exports = {
    stories: ['../src/**/*.stories.(js|ts|mdx)'],
    addons: [
        '@storybook/addon-knobs/register',
        '@storybook/addon-docs',
        '@storybook/addon-a11y/register',
        '@storybook/addon-viewport/register',
    ],
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
                            ...(configType === 'PRODUCTION'
                                ? [
                                      require('postcss-focus')(),
                                      require('postcss-focus-within')(),
                                      require('postcss-focus-visible')(),
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

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [
                            [
                                '@babel/preset-typescript',
                                {
                                    jsxPragma: 'h',
                                    pragmaFrag: 'Fragment',
                                    isTSX: true,
                                    allExtensions: true,
                                },
                            ],
                        ],
                    },
                },
            ],
        });

        config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx', '.vue');

        return config;
    },
};
