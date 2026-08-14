import { test } from '@playwright/test';

test('Response metadata', async ({ page }) => {

  const responsePromise = page.waitForResponse(
    'https://api.chucknorris.io/jokes/categories'
  );

  await page.goto('https://api.chucknorris.io/jokes/categories');

  const response = await responsePromise;

  console.log({
    url: response.url(),
    status: response.status(),
    statusText: response.statusText(),
    headers: await response.allHeaders(),
    securityDetails: await response.securityDetails(),
    serverAddr: await response.serverAddr()
    //,timing: await response.timing() --> data retrieved in timing.spec.ts
  });

});