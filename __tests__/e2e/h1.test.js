const puppeteer = require('puppeteer');

let browser;
let context;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
});

afterAll(async () => {
    await browser.close();
});

beforeEach(async () => {
    context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://test.localhost');
});

afterEach(async () => {
    await context.close();
});

it('has h1', async () => {
    const h1 = await page.$eval('h1', (element) => element.textContent);

    expect(h1).toBeTruthy();
    expect(h1).toEqual('Webpack Boilerplate');
});

it('has title', async () => {
    const title = await page.evaluate(() => document.title);

    expect(title).toBeTruthy();
    expect(title).toEqual('title — [YOUR_SITE_NAME]');
});
