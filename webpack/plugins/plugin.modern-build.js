/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BUILD_PATH } = require('../../webpack.settings.js');

// Safari 10.1 не поддерживает атрибут nomodule.
// Эта переменная содержит фикс для Safari в виде строки.
// Найти фикс можно тут:
// https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
const safariFix =
    "(function(){var d = document;var c = d.createElement('script');if (!('noModule' in c) && 'onbeforeload' in c) {var s = false;d.addEventListener('beforeload', function(e){if (e.target === c){          s = true;} else if(!e.target.hasAttribute('nomodule') || !s) {return;}e.preventDefault();}, true);c.type = 'module';c.src = '.';d.head.appendChild(c);c.remove();}}());";

class ModernBuildPlugin {
    apply(compiler) {
        const pluginName = 'modern-build-plugin';

        // Получаем информацию о Fallback Build
        let legacyManifest;
        try {
            legacyManifest = require(`${BUILD_PATH}/manifest-legacy.json`);
        } catch (err) {}

        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            // Подписываемся на хук html-webpack-plugin,
            // в котором можно менять данные HTML
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(pluginName, (data, callback) => {
                // Добавляем type="module" для modern-файлов
                data.assetTags.scripts.forEach((tag) => {
                    if (tag.tagName === 'script' && tag.attributes) {
                        tag.attributes.type = 'module';
                    }
                });

                if (legacyManifest) {
                    // Вставляем фикс для Safari
                    data.assetTags.scripts.push({
                        tagName: 'script',
                        closeTag: true,
                        innerHTML: safariFix,
                    });

                    // Вставляем fallback-файлы с атрибутом nomodule
                    Object.keys(legacyManifest)
                        .filter((key) => /\.js$/.test(key)) // только js-файлы
                        .filter((key) => key.includes('vendor.js') || key.includes('app.js')) // vendor и app
                        .reduce((arr, fileName) => {
                            const newArr = arr.slice();
                            // vendor build should come first
                            if (/vendor/.test(fileName)) {
                                newArr.unshift(fileName);
                            } else {
                                newArr.push(fileName);
                            }
                            return newArr;
                        }, [])
                        .forEach((fileName) =>
                            data.assetTags.scripts.push({
                                tagName: 'script',
                                closeTag: true,
                                attributes: {
                                    src: legacyManifest[fileName],
                                    nomodule: true,
                                    defer: true,
                                },
                            }),
                        );
                }

                callback();
            });
        });
    }
}

module.exports = ModernBuildPlugin;
