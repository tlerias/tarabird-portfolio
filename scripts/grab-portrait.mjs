import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.meetwithrollcall.com/u/tara', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const el = document.querySelector('.flex-1.overflow-y-auto');
  if (el) el.scrollTop = 800;
});
await page.waitForTimeout(2000);

// find the avatar
const avatarUrl = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  const avatar = imgs.find(i => i.alt === 'Tara Bird avatar');
  return avatar ? avatar.src : null;
});

if (!avatarUrl) throw new Error('Avatar not found');

const res = await page.request.get(avatarUrl);
const buf = await res.body();
await writeFile('public/portrait.jpg', buf);
console.log('saved public/portrait.jpg', buf.length, 'bytes');
await browser.close();
