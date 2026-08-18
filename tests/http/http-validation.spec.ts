import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';

const validateCommonHeaders = (headers: Record<string, string | string[] | undefined>) => {
  expect(headers['content-type']).toBeDefined();
  expect(typeof headers['content-type']).toBe('string');
  expect((headers['content-type'] as string).toLowerCase()).toContain('application/json');

  /* as using cloudfare the cache-control header dont exist in the headers so the validation 
     following 3 validations will fail if running with the chucknorris.io API.
  */
 
  expect(headers['cache-control']).toBeDefined();
  expect(typeof headers['cache-control']).toBe('string');
  expect((headers['cache-control'] as string).length).toBeGreaterThan(0); 

  expect(headers['date']).toBeDefined();
  expect(typeof headers['date']).toBe('string');
  expect(new Date(headers['date'] as string).toString()).not.toBe('Invalid Date');

  expect(headers['server']).toBeDefined();
  expect(typeof headers['server']).toBe('string');
  expect((headers['server'] as string).trim().length).toBeGreaterThan(0);

  expect(headers['content-length']).toBeDefined();
  expect(typeof headers['content-length']).toBe('string');
  expect(Number(headers['content-length'])).toBeGreaterThan(0);
};

test.describe('HTTP Validation for Chuck Norris API', () => {
  test('GET /jokes/random returns valid HTTP headers and status @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/random`);
    expect(response.status()).toBe(200);

    validateCommonHeaders(response.headers());
  });

  test('GET /jokes/categories returns valid HTTP headers and status', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/categories`);
    expect(response.status()).toBe(200);

    validateCommonHeaders(response.headers());
  });

  test('GET /jokes/search?query=test returns valid HTTP headers and status @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/search?query=test`);
    expect(response.status()).toBe(200);

    validateCommonHeaders(response.headers());
  });
});
