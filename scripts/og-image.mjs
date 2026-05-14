import { chromium } from 'playwright';

const html = `<!doctype html>
<html><head><style>
  @import url('https://fonts.bunny.net/css?family=inter:800');
  body { margin: 0; padding: 0; background: linear-gradient(165deg, #fdf6f0 0%, #fdf6f0 40%, #f3eef8 100%); width: 1200px; height: 630px; font-family: Inter, sans-serif; display: flex; flex-direction: column; justify-content: center; padding: 80px; box-sizing: border-box; }
  .label { font-size: 18px; letter-spacing: 4px; text-transform: uppercase; color: #5b4380; font-family: monospace; font-weight: 600; }
  h1 { font-size: 110px; font-weight: 800; letter-spacing: -4px; line-height: 0.95; margin: 20px 0 0 0; color: #0d2820; }
  .hi { background: #5fc9a0; padding: 0 18px; border-radius: 12px; }
  .lav { background: #8b7ab8; padding: 0 18px; border-radius: 12px; color: #fef9f0; }
  p { font-size: 26px; margin-top: 40px; color: #1a1a1a; max-width: 800px; line-height: 1.4; }
</style></head><body>
  <div class="label">hi, i'm tara</div>
  <h1>I build<br><span class="hi">cool</span> &amp; <span class="lav">useful</span> things.</h1>
  <p>tarabird.com</p>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('✓ og-image.png');
