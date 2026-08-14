import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.chucknorris.io';
const requiredJokeFields = ['icon_url', 'id', 'url', 'value'] as const;

function assertNonEmptyString(value: unknown, fieldName: string) {
  expect(value, `${fieldName} should be present`).toBeTruthy();
  expect(typeof value).toBe('string');
  expect((value as string).trim().length).toBeGreaterThan(0);
}

function assertValidUrl(value: unknown, fieldName: string) {
  assertNonEmptyString(value, fieldName);
  expect(() => new URL(value as string), `${fieldName} should be a valid URL`).not.toThrow();
}

test.describe('JSON Validation for Chuck Norris API @contract', () => {
  test('validates the random joke payload schema and field types @regression', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/random`);
    expect(response.status()).toBe(200);

    const payload = await response.json() as Record<string, unknown>;
    expect(typeof payload).toBe('object');
    expect(payload).not.toBeNull();

    for (const field of requiredJokeFields) {
      expect(payload).toHaveProperty(field);
      expect(payload[field]).not.toBeNull();
    }

    assertNonEmptyString(payload.icon_url, 'icon_url');
    assertNonEmptyString(payload.id, 'id');
    assertValidUrl(payload.url, 'url');
    assertNonEmptyString(payload.value, 'value');

    if (payload.categories !== undefined) {
      expect(Array.isArray(payload.categories)).toBeTruthy();
      for (const category of payload.categories as unknown[]) {
        expect(typeof category).toBe('string');
        expect((category as string).trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('validates the categories payload shape and entry values', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/categories`);
    expect(response.status()).toBe(200);

    const payload = await response.json() as unknown[];
    expect(Array.isArray(payload)).toBeTruthy();
    expect(payload.length).toBeGreaterThan(0);

    for (const category of payload) {
      expect(typeof category).toBe('string');
      expect((category as string).trim().length).toBeGreaterThan(0);
    }
  });

  test('validates the search payload structure and nested joke objects', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/search?query=chuck`);
    expect(response.status()).toBe(200);

    const payload = await response.json() as Record<string, unknown>;
    expect(typeof payload).toBe('object');
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('result');
    expect(typeof payload.total).toBe('number');
    expect(Array.isArray(payload.result)).toBeTruthy();

    if ((payload.result as unknown[]).length > 0) {
      const firstResult = (payload.result as unknown[])[0] as Record<string, unknown>;
      expect(typeof firstResult).toBe('object');
      expect(firstResult).not.toBeNull();

      assertNonEmptyString(firstResult.id, 'result.id');
      assertNonEmptyString(firstResult.value, 'result.value');
      assertValidUrl(firstResult.url, 'result.url');
      assertValidUrl(firstResult.icon_url, 'result.icon_url');

      if (firstResult.categories !== undefined) {
        expect(Array.isArray(firstResult.categories)).toBeTruthy();
        for (const category of firstResult.categories as unknown[]) {
          expect(typeof category).toBe('string');
          expect((category as string).trim().length).toBeGreaterThan(0);
        }
      }

      for (const key of ['created_at', 'updated_at'] as const) {
        if (firstResult[key] !== undefined) {
          assertNonEmptyString(firstResult[key], key);
        }
      }
    }
  });

  test('rejects null or empty required values in the random joke response', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/jokes/random`);
    expect(response.status()).toBe(200);

    const payload = await response.json() as Record<string, unknown>;
    for (const field of requiredJokeFields) {
      expect(payload[field], `${field} should not be null or empty`).not.toBeNull();
      expect(payload[field], `${field} should not be empty`).not.toBe('');
    }
  });
});
