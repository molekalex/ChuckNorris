import {test,expect} from '@playwright/test';
test('categories',async({request})=>{
 const r=await request.get('https://api.chucknorris.io/jokes/categories');
 expect(r.ok()).toBeTruthy();
 const b=await r.json();
 expect(Array.isArray(b)).toBeTruthy();
 expect(b.length).toBeGreaterThan(0);
});
