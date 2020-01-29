const fs = require('fs');
const path = require('path');
const validateOptions = require('schema-utils');

const pluginName = 'insert-hashes-plugin';

const deleteLine = (data, matchedRegex) => {
    const dataArray = data.split('\n');
    let lastIndex = -1;
    for (let i = 0; i < dataArray.length; i++) {
        if (matchedRegex.test(dataArray[i])) {
            lastIndex = i;
            break;
        }
    }
    dataArray.splice(lastIndex, 1);
    return dataArray.join('\n');
};

const writeToFile = ({ srcTemplatePath, destTemplatePath }, replaceData = []) => {
    fs.readFile(srcTemplatePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`[${pluginName}] ${err}`);
            return;
        }

        let newData = data;
        replaceData.forEach(({ filepath, regex }) => {
            if (filepath) {
                // Write the data
                newData = newData.replace(regex, filepath);
            } else {
                // Delete the line
                newData = deleteLine(newData, regex);
            }
        });

        fs.writeFile(destTemplatePath, newData, (error) => {
            if (error) {
                console.error(`[${pluginName}] Error occured trying writing data into ${destTemplatePath} file.`);
                console.error(error.message);
                return;
            }

            console.log(`[${pluginName}] Paths in ${destTemplatePath} were successfully updated.`);
        });
    });
};

const schema = {
    type: 'object',
    properties: {
        css: {
            srcTemplatePath: 'string',
            destTemplatePath: 'string',
        },
        js: {
            srcTemplatePath: 'string',
            destTemplatePath: 'string',
        },
    },
};

class BitrixInsertHashesPlugin {
    constructor(options = {}) {
        validateOptions(schema, options, pluginName);
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.done.tap(pluginName, () => {
            const legacyManifestPath = path.join(__dirname, '../../build/manifest-legacy.json');
            const modernManifestPath = path.join(__dirname, '../../build/manifest-modern.json');

            const modernManifestData = fs.existsSync(modernManifestPath)
                ? JSON.parse(fs.readFileSync(modernManifestPath))
                : null;
            const legacyManifestData = fs.existsSync(legacyManifestPath)
                ? JSON.parse(fs.readFileSync(legacyManifestPath))
                : null;

            const cssFilenamesMap = new Map();
            const jsFilenamesMap = new Map();

            cssFilenamesMap.set(
                {
                    srcTemplatePath: this.options.css.srcTemplatePath,
                    destTemplatePath: this.options.css.destTemplatePath,
                },
                [
                    {
                        filepath: modernManifestData ? modernManifestData['vendor.css'] : null,
                        regex: /%css_vendor_path%/g,
                    },
                    {
                        filepath: modernManifestData ? modernManifestData['app.css'] : null,
                        regex: /%css_app_path%/g,
                    },
                ],
            );

            jsFilenamesMap.set(
                {
                    srcTemplatePath: this.options.js.srcTemplatePath,
                    destTemplatePath: this.options.js.destTemplatePath,
                },
                [
                    {
                        filepath: modernManifestData ? modernManifestData['vendor.js'] : null,
                        regex: /%js_modern_vendor_path%/g,
                    },
                    {
                        filepath: modernManifestData ? modernManifestData['app.js'] : null,
                        regex: /%js_modern_app_path%/g,
                    },
                    {
                        filepath: legacyManifestData ? legacyManifestData['vendor.js'] : null,
                        regex: /%js_legacy_vendor_path%/g,
                    },
                    {
                        filepath: legacyManifestData ? legacyManifestData['app.js'] : null,
                        regex: /%js_legacy_app_path%/g,
                    },
                ],
            );

            [cssFilenamesMap, jsFilenamesMap].forEach((map) => {
                map.forEach((replaceData, templatePaths) => {
                    writeToFile(templatePaths, replaceData);
                });
            });
        });
    }
}

module.exports = BitrixInsertHashesPlugin;
