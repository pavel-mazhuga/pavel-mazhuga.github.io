module.exports = {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'h',
                pragmaFrag: 'Fragment',
            },
        ],
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        [
            '@babel/preset-typescript',
            {
                jsxPragma: 'h',
                isTSX: true,
                allExtensions: true,
            },
        ],
    ],
};
