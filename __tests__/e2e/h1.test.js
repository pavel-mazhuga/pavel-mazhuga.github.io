// const puppeteer = require('puppeteer');

// let browser;
// let context;
// let page;

beforeAll(async () => {
    // browser = await puppeteer.launch();
});

afterAll(async () => {
    // await browser.close();
});

beforeEach(async () => {
    // context = await browser.createIncognitoBrowserContext();
    // page = await context.newPage();
    // await page.goto('http://test.localhost');
});

afterEach(async () => {
    // await context.close();
});

it('h1 equals "Webpack Boilerplate"', async () => {
    // const h1 = await page.$eval('h1', (element) => element.textContent);

    // expect(h1).toBeTruthy();
    // expect(h1).toEqual('Webpack Boilerplate');
});
