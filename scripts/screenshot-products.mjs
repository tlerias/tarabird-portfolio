import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const targets = [
  {
    url: 'https://layoffcalculator.com',
    out: 'public/screenshots/severance-hero.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 1500,
  },
  {
    url: 'https://www.meetwithrollcall.com/u/tara',
    out: 'public/screenshots/rollcall-profile.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 3000,
    scrollTo: 800,
  },
  {
    url: 'https://knock-it-off.vercel.app',
    out: 'public/screenshots/knock-it-off-cat-select.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 3000,
  },
];

await mkdir('public/screenshots', { recursive: true });
const browser = await chromium.launch();

for (const t of targets) {
  const ctx = await browser.newContext({ viewport: t.viewport });
  const page = await ctx.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle' });
  if (t.scrollTo) {
    await page.evaluate((y) => {
      const scrollable = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollable) scrollable.scrollTop = y;
      else window.scrollTo(0, y);
    }, t.scrollTo);
  }
  await page.waitForTimeout(t.waitMs);
  await page.screenshot({ path: t.out, fullPage: false });
  console.log(`✓ ${t.out}`);
  await ctx.close();
}
await browser.close();
console.log('done.');
