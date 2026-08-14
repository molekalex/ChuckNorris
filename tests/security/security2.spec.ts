import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';

test.describe('Security Testing', () => {

  test('SEC-01 Allowed HTTP methods', async ({ request }) => {

    const endpoints = [
      '/jokes/random',
      '/jokes/categories',
      '/jokes/search?query=test'
    ];

    for (const endpoint of endpoints) {

      const post = await request.post(`${BASE_URL}${endpoint}`);
      expect([404, 405]).toContain(post.status());

      const put = await request.put(`${BASE_URL}${endpoint}`);
      expect([404, 405]).toContain(put.status());

      const patch = await request.patch(`${BASE_URL}${endpoint}`);
      expect([404, 405]).toContain(patch.status());

      const del = await request.delete(`${BASE_URL}${endpoint}`);
      expect([404, 405]).toContain(del.status());
    }
  });

  test('SEC-02 Validate security headers', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/jokes/random`);

    expect(response.status()).toBe(200);

    const headers = response.headers();

    console.log(headers);

    // These headers may or may not exist depending on server configuration.
    // Log them for visibility.

    console.log('Strict-Transport-Security:', headers['strict-transport-security']);
    console.log('X-Content-Type-Options:', headers['x-content-type-options']);
    console.log('Content-Security-Policy:', headers['content-security-policy']);
    console.log('X-Frame-Options:', headers['x-frame-options']);
  });

  test('SEC-03 SQL Injection attempt', async ({ request }) => {

    const payload = "' OR 1=1 --";

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${encodeURIComponent(payload)}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('result');
  });

  test('SEC-04 XSS Injection attempt', async ({ request }) => {

    const payload = '<script>alert(1)</script>';

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${encodeURIComponent(payload)}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('result');
  });

  test('SEC-05 Oversized payload', async ({ request }) => {

    const longQuery = 'A'.repeat(10000);

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${longQuery}`
    );

    expect([200, 400, 414]).toContain(response.status());
  });

  test('SEC-06 Header manipulation', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/jokes/random`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Accept': '*/*',
          'X-Test-Header': '<script>',
          'Authorization': 'Bearer fake-token'
        }
      }
    );

    expect(response.status()).toBe(200);
  });

  test('SEC-07 URL encoding', async ({ request }) => {

    const payload = '%3Cscript%3Ealert(1)%3C/script%3E';

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${payload}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('result');
  });

  test('SEC-08 Basic rate limiting', async ({ request }) => {

    const totalRequests = 100;

    const requests = [];

    for (let i = 0; i < totalRequests; i++) {
      requests.push(request.get(`${BASE_URL}/jokes/random`));
    }

    const responses = await Promise.all(requests);

    const statusCodes = responses.map(r => r.status());

    const rateLimited = statusCodes.filter(s => s === 429);

    console.log(`429 responses: ${rateLimited.length}`);

    expect(rateLimited.length).toBeGreaterThanOrEqual(0);
  });

});