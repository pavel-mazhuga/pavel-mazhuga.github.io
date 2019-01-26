/* eslint-disable */
// Safari 10.1 не поддерживает атрибут nomodule.
// Эта переменная содержит фикс для Safari в виде строки.
// Найти фикс можно тут:
// https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
const safariFix = '(function(){var d = document;var c = d.createElement(\'script\');if (!(\'noModule\' in c) && \'onbeforeload\' in c) {var s = false;d.addEventListener(\'beforeload\', function(e){if (e.target === c){          s = true;} else if(!e.target.hasAttribute(\'nomodule\') || !s) {return;}e.preventDefault();}, true);c.type = \'module\';c.src = \'.\';d.head.appendChild(c);c.remove();}}());';

class ModernBuildPlugin {
  apply(compiler) {
    const pluginName = 'modern-build-plugin';

    // Получаем информацию о Fallback Build
    // const fallbackManifest = require('path/to/dist/fallback/manifest.json');

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Подписываемся на хук html-webpack-plugin,
      // в котором можно менять данные HTML
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(pluginName, (data, cb) => {
        // Добавляем type="module" для modern-файлов
        data.body.forEach((tag) => {
          if (tag.tagName === 'script' && tag.attributes) {
            tag.attributes.type = 'module';
          }
        });

        // Вставляем фикс для Safari
        data.body.push({
          tagName: 'script',
          closeTag: true,
          innerHTML: safariFix,
        });

        // Вставляем fallback-файлы с атрибутом nomodule
        const legacyAsset = {
          tagName: 'script',
          closeTag: true,
          attributes: {
            // src: fallbackManifest['app.js'],
            src: 'js/legacy/app.min.js',
            nomodule: true,
            defer: true,
          },
        };
        data.body.push(legacyAsset);

        cb();
      });
    });
  }
}

module.exports = ModernBuildPlugin;