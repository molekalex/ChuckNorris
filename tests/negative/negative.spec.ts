import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';

const parseJson = async (response: Awaited<ReturnType<typeof response.json>>) => {
  const body = await response.json();
  expect(typeof body).toBe('object');
  return body;
};

test.describe('Negative test cases for Chuck Norris API', () => {
test.describe.configure({ mode: 'parallel' });

  test('Invalid endpoint returns a client error @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/joke/random`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('Invalid HTTP method returns client error for /jokes/random', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/jokes/random`, { data: { invalid: true } });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('Invalid category returns a client error response @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/random?category=${encodeURIComponent('invalid-category-test')}`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
  });

  test('Empty search query is handled gracefully', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/search?query=`);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
    expect(payload).toBeTruthy();
    expect(payload).toHaveProperty('message');
  });

  test('Long search query is handled gracefully without server error @regression', async ({ request }) => {
    const longQuery = 'x'.repeat(2000);
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(longQuery)}`);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
    if (payload.result) {
      expect(Array.isArray(payload.result)).toBeTruthy();
    }
  });

  test('SQL injection payload does not produce a server error', async ({ request }) => {
    const injection = "' OR '1'='1";
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(injection)}`);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
  });

  test('XSS payload does not produce a server error', async ({ request }) => {
    const payloadValue = '<script>alert(1)</script>';
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(payloadValue)}`);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
  });

  test('Unicode and emoji query is handled without failure', async ({ request }) => {
    const query = '😊🔥';
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(query)}`);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
    if (payload.result) {
      expect(Array.isArray(payload.result)).toBeTruthy();
    }
  });
});
