const { configureBabelLoader } = require('../../webpack/webpack.config.common.js');
const configurePostCSS = require('../../webpack/postcss.config.js');

module.exports = {
    stories: [
        '../../src/js/custom-elements/**/*.stories.mdx',
        '../../src/js/custom-elements/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.ce\.(css|scss)$/i,
            use: [
                { loader: 'raw-loader' },
                { loader: 'extract-loader' },
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: configurePostCSS(configType === 'PRODUCTION'),
                    },
                },
                { loader: 'sass-loader' },
            ],
        });

        config.module.rules.push({
            test: /\.(css|scss)$/i,
            exclude: {
                test: /\.ce\.(css|scss)$/i,
            },
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: configurePostCSS(configType === 'PRODUCTION'),
                    },
                },
                { loader: 'sass-loader' },
            ],
        });

        config.module.rules.push(configureBabelLoader(true));

        return config;
    },
};
