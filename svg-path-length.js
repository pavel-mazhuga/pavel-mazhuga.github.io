/* eslint no-await-in-loop: "off", no-restricted-syntax: "off" */
const fs = require('fs');
const glob = require('glob');
const puppeteer = require('puppeteer');

const Lengthy = fs.readFileSync(require.resolve('lengthy-svg'));
const svgFiles = glob.sync('src/partials/**/*.svg');

const svgLengthFunction = () => {
    const svgRoot = document.getElementById('svgRoot');
    // const selector = 'path, use, rect, ellipse, line, circle, polyline, polygon';
    const selector = '.path-length';
    svgRoot.querySelectorAll(selector).forEach((item) => {
        const result = Lengthy.getLength(item);
        item.style.setProperty('--path-length', result);
        // item.setAttribute('data-path-length', result);
        // item.classList.add('path-length');
    });
};

puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();
    for (const file of svgFiles) {
        console.log(`[svg-path-length] ${file} - start parsing...`);
        const content = [
            '<div id="svgRoot">', fs.readFileSync(file), '</div>',
            '<script type="text/javascript">', Lengthy, '</script>',
            '<script type="text/javascript">', `(${svgLengthFunction.toString()})();`, '</script>',
        ].join('\n');

        await page.setContent(content);
        const result = await page.$eval('#svgRoot', element => element.innerHTML);
        fs.writeFileSync(file, result.trim());

        console.log(`[svg-path-length] ${file} - parsing ended;\n`);
    }
    await browser.close();
});
