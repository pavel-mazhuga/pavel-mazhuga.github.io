const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
module.exports = withPWA({
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    experimental: {
        concurrentFeatures: true,
        runtime: 'nodejs',
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: ['raw-loader', 'glslify-loader'],
        });

        return config;
    },
    pwa: {
        disable: true,
        dest: 'public',
    },
});
