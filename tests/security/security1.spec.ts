import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';

test.describe('Chuck Norris API - Security Tests @security', () => {

  test('SEC-01 Allowed HTTP methods', async ({ request }) => {

    const endpoints = [
      '/jokes/random',
      '/jokes/categories',
      '/jokes/search?query=car'
    ];

    for (const endpoint of endpoints) {

      const post = await request.post(`${BASE_URL}${endpoint}`);
      expect([400, 404, 405]).toContain(post.status());

      const put = await request.put(`${BASE_URL}${endpoint}`);
      expect([400, 404, 405]).toContain(put.status());

      const patch = await request.patch(`${BASE_URL}${endpoint}`);
      expect([400, 404, 405]).toContain(patch.status());

      const del = await request.delete(`${BASE_URL}${endpoint}`);
      expect([400, 404, 405]).toContain(del.status());
    }
  });

  test('SEC-02 Verify security headers', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/jokes/random`);

    expect(response.ok()).toBeTruthy();

    const headers = response.headers();

    console.log(headers);

    // Recommended headers
    expect(headers['content-type']).toContain('application/json');

    // Optional security headers
    console.log('x-frame-options:', headers['x-frame-options']);
    console.log('x-content-type-options:', headers['x-content-type-options']);
    console.log('strict-transport-security:', headers['strict-transport-security']);
    console.log('content-security-policy:', headers['content-security-policy']);
  });

  test('SEC-03 SQL Injection attempts', async ({ request }) => {

    const payloads = [
      "' OR 1=1--",
      "\" OR \"1\"=\"1",
      "'; DROP TABLE users;--",
      "admin' --"
    ];

    for (const query of payloads) {

      const response = await request.get(
        `${BASE_URL}/jokes/search?query=${encodeURIComponent(query)}`
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('result');
    }
  });

  test('SEC-04 XSS Injection attempts', async ({ request }) => {

    const payloads = [
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>'
    ];

    for (const payload of payloads) {

      const response = await request.get(
        `${BASE_URL}/jokes/search?query=${encodeURIComponent(payload)}`
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();

      expect(body.result).toBeDefined();
    }
  });

  test('SEC-05 Oversized payload', async ({ request }) => {

    const hugeQuery = 'A'.repeat(10000);

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${hugeQuery}`
    );

    expect([200, 400, 414]).toContain(response.status());
  });

  test('SEC-06 Header manipulation', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/jokes/random`, {

      headers: {
        'X-Forwarded-For': '127.0.0.1',
        'Host': 'evil.com',
        'Referer': 'https://evil.com',
        'Origin': 'https://evil.com'
      }

    });

    expect(response.ok()).toBeTruthy();
  });

  test('SEC-07 URL Encoding', async ({ request }) => {

    const payload = '%3Cscript%3Ealert(1)%3C%2Fscript%3E';

    const response = await request.get(
      `${BASE_URL}/jokes/search?query=${payload}`
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body).toHaveProperty('result');
  });

  test('SEC-08 Rate limiting', async ({ request }) => {

    const requests = [];

    for (let i = 0; i < 100; i++) {
      requests.push(
        request.get(`${BASE_URL}/jokes/random`)
      );
    }

    const responses = await Promise.all(requests);

    const statusCodes = responses.map(r => r.status());

    console.log(statusCodes);

    // API may or may not implement throttling.
    expect(
      statusCodes.every(code =>
        code === 200 || code === 429
      )
    ).toBeTruthy();
  });

});