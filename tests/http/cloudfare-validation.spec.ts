import { test, expect, APIResponse } from '@playwright/test';

test.describe('Cloudflare HTTP Header Validation', () => {

  test('should validate HTTP and Cloudflare headers', async ({ request }) => {

    const endpoint = 'https://api.chucknorris.io/jokes/categories';

    const response: APIResponse = await request.get(endpoint);

    // ------------------------------------------------
    // HTTP Status
    // ------------------------------------------------

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // ------------------------------------------------
    // Headers
    // ------------------------------------------------

    const headers = response.headers();

   

    // ----------------------------
    // Security Headers
    // ----------------------------

    //expect(headers['x-content-type-options']).toBe('nosniff');

    expect(headers['x-frame-options']).toBeDefined();

    // Optional
    // expect(headers['strict-transport-security']).toBeDefined();

    // ------------------------------------------------
    // Cloudflare Headers
    // ------------------------------------------------

    expect(headers['server']).toContain('cloudflare');

    expect(headers['cf-ray']).toBeDefined();

    expect(headers['cf-cache-status']).toBeDefined();
  
    const cfCacheStatus = headers['cf-cache-status'];

    expect([
      'HIT',
      'MISS',
      'EXPIRED',
      'REVALIDATED',
      'STALE',
      'BYPASS',
      'DYNAMIC'
    ]).toContain(cfCacheStatus);

        if (cfCacheStatus === 'HIT') {
      console.log('✓ Served directly from Cloudflare cache.');
    }

    if (cfCacheStatus === 'MISS') {
      console.log('✓ Cloudflare contacted the origin server.');
    }

    if (cfCacheStatus === 'BYPASS') {
      console.log('✓ Cloudflare intentionally skipped caching.');
    }

      if (cfCacheStatus === 'DYNAMIC') {
      console.log('✓ Cloudflare determined the content is dynamic and did not cache it..');
    }



    // -------------------------
    // Timing
    // -------------------------

    expect(response.status()).toBeLessThan(400);

    console.log(
      `Response Time: ${response.headers()['server-timing'] ?? 'Not Reported'}`
    );

 
    // ------------------------------------------------
    // Response Body
    // ------------------------------------------------

    const payload = await response.json();

    expect(payload).toBeTruthy();

    // Example:
    // expect(payload).toHaveProperty('id');

  });

});