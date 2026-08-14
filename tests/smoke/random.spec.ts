import {test,expect} from '@playwright/test';
test('random joke',async({request})=>{
 const r=await request.get('https://api.chucknorris.io/jokes/random');
 expect(r.status()).toBe(200);
 const b=await r.json();
 expect(b).toHaveProperty('id');
 expect(b).toHaveProperty('value');
});
