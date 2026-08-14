import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';
const requiredJokeFields = ['icon_url', 'id', 'url', 'value'];

test.describe('Functional test cases for Chuck Norris API', () => {
  test.describe.configure({ mode: 'serial' });
  
  test('TC-F01 / TC-F02: GET /jokes/random returns HTTP 200 with required fields @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/random`);
    expect(response.status()).toBe(200);

    const payload = await response.json();
    for (const field of requiredJokeFields) {
      expect(payload).toHaveProperty(field);
      expect(payload[field]).not.toBeNull();
      expect(payload[field]).not.toBe('');
    }
  });

  test('TC-F03: multiple GET /jokes/random requests return valid responses and content changes', async ({ request }) => {
    const first = await request.get(`${BASE_URL}/jokes/random`);
    const second = await request.get(`${BASE_URL}/jokes/random`);

    expect(first.status()).toBe(200);
    expect(second.status()).toBe(200);

    const firstBody = await first.json();
    const secondBody = await second.json();

    for (const field of requiredJokeFields) {
      expect(firstBody).toHaveProperty(field);
      expect(secondBody).toHaveProperty(field);
    }

    const firstValue = firstBody.value as string;
    const secondValue = secondBody.value as string;
    expect(typeof firstValue).toBe('string');
    expect(typeof secondValue).toBe('string');
    expect(firstValue.length).toBeGreaterThan(0);
    expect(secondValue.length).toBeGreaterThan(0);
    expect(firstValue === secondValue).toBeFalsy();
  });

  test('TC-F04 / TC-F05 / TC-F06: GET /jokes/categories returns a non-empty array of valid strings @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/categories`);
    expect(response.status()).toBe(200);

    const categories = await response.json();
    expect(Array.isArray(categories)).toBeTruthy();
    expect(categories.length).toBeGreaterThan(0);

    for (const category of categories) {
      expect(typeof category).toBe('string');
      expect(category.trim()).not.toBe('');
    }
  });

  test('TC-F07 / TC-F08: GET /jokes/random?category={validCategory} returns a joke for that category @regression', async ({ request }) => {
    const categoriesResponse = await request.get(`${BASE_URL}/jokes/categories`);
    expect(categoriesResponse.status()).toBe(200);
    const categories = await categoriesResponse.json();
    let max = categories.length;
    let ram = Math.floor(Math.random()*max);
    const validCategory = categories[ram];
    
    expect(typeof validCategory).toBe('string');
    expect(validCategory.trim()).not.toBe('');

    const response = await request.get(`${BASE_URL}/jokes/random?category=${encodeURIComponent(validCategory)}`);
    expect(response.status()).toBe(200);

    const payload = await response.json();
    for (const field of requiredJokeFields) {
      expect(payload).toHaveProperty(field);
    }
    console.log("\n\n"+payload.value);
    console.log("joke's lenght in characters: "+ payload.value.length);

    expect(Array.isArray(payload.categories)).toBeTruthy();
    expect(payload.categories).toContain(validCategory);
    expect(payload.value.length).toBeGreaterThan(5);
    expect(payload.value.length).toBeLessThan(400);
      


  });

  test('TC-F09: GET /jokes/random?category={invalidCategory} returns a client error response', async ({ request }) => {
    const invalidCategory = 'category-does-not-exist-123';
    const response = await request.get(`${BASE_URL}/jokes/random?category=${encodeURIComponent(invalidCategory)}`);

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
  });

  test('TC-F10: GET /jokes/search?query={keyword} returns relevant results for a known keyword @regression', async ({ request }) => {
    //const query = 'chuck';
    const query = 'a pro at the golf club'
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(query)}`);
    expect(response.status()).toBe(200);
    
    const payload = await response.json();
    console.log(payload);
    console.log(JSON.stringify(payload, null, 2));
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('result');
    expect(Array.isArray(payload.result)).toBeTruthy();
    expect(payload.total).toBeGreaterThanOrEqual(0);

    if (payload.result.length > 0) {
      expect(payload.result[0]).toHaveProperty('id');
      expect(payload.result[0]).toHaveProperty('value');
    }
  });

  test('TC-F11: GET /jokes/search?query={nonExistingKeyword} returns an empty result set', async ({ request }) => {
    const query = 'thiskeyworddoesnotexist123456';
    const response = await request.get(`${BASE_URL}/jokes/search?query=${encodeURIComponent(query)}`);
    expect(response.status()).toBe(200);
    
    const payload = await response.json();
    console.log(payload);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('result');
    expect(payload.total).toBe(0);
    expect(Array.isArray(payload.result)).toBeTruthy();
    expect(payload.result.length).toBe(0);
  });

  test('TC-F12: GET /jokes/search?query= handles empty query gracefully', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/search?query=`);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
    
    const payload = await response.json();
    console.log(payload)
    console.log(JSON.stringify(payload, null, 2));
    expect(payload).toBeTruthy();
    expect(payload).toHaveProperty('error');
    expect(payload).toHaveProperty('message');
    //expect(Array.isArray(payload.violations)).toBeTruthy();
  });

  test('TC-F13 / TC-F14: GET /jokes/{id} returns the expected joke payload for a valid ID @regression', async ({ request }) => {
    const randomResponse = await request.get(`${BASE_URL}/jokes/random`);
    expect(randomResponse.status()).toBe(200);

    const randomJoke = await randomResponse.json();
    expect(randomJoke).toHaveProperty('id');
    const jokeId = randomJoke.id as string;

    const response = await request.get(`${BASE_URL}/jokes/${encodeURIComponent(jokeId)}`);
    expect(response.status()).toBe(200);

    const payload = await response.json();
    expect(payload.id).toBe(jokeId);
    for (const field of requiredJokeFields) {
      expect(payload).toHaveProperty(field);
      console.log(`${field}:`, payload[field]);
    }
  });

  test('TC-F15: GET /jokes/{id} with invalid ID returns a client error response', async ({ request }) => {
    const invalidId = 'invalid-id-12345';
    const response = await request.get(`${BASE_URL}/jokes/${encodeURIComponent(invalidId)}`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);

    const payload = await response.json();
    expect(typeof payload).toBe('object');
  });
});
