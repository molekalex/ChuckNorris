import { chromium, test } from '@playwright/test';

test('Capture network timings', async () => {

    const browser = await chromium.launch();

    const page = await browser.newPage();

    const client = await page.context().newCDPSession(page);

    await client.send('Network.enable');

    client.on('Network.responseReceived', params => {

        console.log(params.response.timing);

    });

    await page.goto('https://api.chucknorris.io/jokes/categories');

    await browser.close();

});