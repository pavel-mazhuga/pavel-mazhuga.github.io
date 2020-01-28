const fs = require('fs');
const path = require('path');

const legacyManifestPath = path.join(__dirname, '../build/manifest-legacy.json');
const modernManifestPath = path.join(__dirname, '../build/manifest-modern.json');

const modernManifestData = JSON.parse(fs.readFileSync(modernManifestPath));
const legacyManifestData = JSON.parse(fs.readFileSync(legacyManifestPath));

const cssFilenamesMap = new Map();
const jsFilenamesMap = new Map();

cssFilenamesMap.set(
    {
        srcTemplatePath: path.join(__dirname, '../src/php_includes/css.php'),
        destTemplatePath: path.join(__dirname, '../../includes/css.php'),
    },
    [
        {
            filepath: modernManifestData['vendor.css'],
            regex: /%css_vendor_path%/g,
        },
        {
            filepath: modernManifestData['app.css'],
            regex: /%css_app_path%/g,
        },
    ],
);

jsFilenamesMap.set(
    {
        srcTemplatePath: path.join(__dirname, '../src/php_includes/js.php'),
        destTemplatePath: path.join(__dirname, '../../includes/js.php'),
    },
    [
        {
            filepath: modernManifestData['vendor.js'],
            regex: /%js_modern_vendor_path%/g,
        },
        {
            filepath: modernManifestData['app.js'],
            regex: /%js_modern_app_path%/g,
        },
        {
            filepath: legacyManifestData['vendor.js'],
            regex: /%js_legacy_vendor_path%/g,
        },
        {
            filepath: legacyManifestData['app.js'],
            regex: /%js_legacy_app_path%/g,
        },
    ],
);

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
            console.log(err);
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
                console.log(`Error occured trying writing data into ${destTemplatePath} file.`, err);
                return;
            }

            console.log(`Paths in ${destTemplatePath} were successfully updated.`);
        });
    });
};

[cssFilenamesMap, jsFilenamesMap].forEach((map) => {
    map.forEach((replaceData, templatePaths) => {
        writeToFile(templatePaths, replaceData);
    });
});
