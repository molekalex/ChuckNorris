import {APIRequestContext,expect} from '@playwright/test';
export async function get(ctx:APIRequestContext,url:string){const r=await ctx.get(url);expect(r.ok()).toBeTruthy();return r;}
