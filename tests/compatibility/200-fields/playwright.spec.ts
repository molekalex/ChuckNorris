import { test, expect } from '@playwright/test';

test('Compatibility', async ({ request }) => {

    const response =
        await request.get(
            'https://api.chucknorris.io/jokes/random'
        );

    expect(response.status()).toBe(200);

    const json = await response.json();

    expect(json).toHaveProperty("id");
    expect(json).toHaveProperty("value");
    expect(json).toHaveProperty("icon_url");
    expect(json).toHaveProperty("url");

    expect(typeof json.id).toBe("string");

});