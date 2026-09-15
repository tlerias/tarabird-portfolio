import { chromium } from 'playwright';
import QRCode from 'qrcode';

const url = 'https://tarabird.com/hi';

const qrSvg = await QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 0,
  color: { dark: '#0d2820', light: '#00000000' },
});

const html = `<!doctype html>
<html><head><style>
  @import url('https://fonts.bunny.net/css?family=inter:800,600,400|jetbrains-mono:600');
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    width: 1080px;
    background: linear-gradient(165deg, #fdf6f0 0%, #fdf6f0 42%, #f3eef8 100%);
    font-family: Inter, sans-serif;
    display: flex; flex-direction: column; align-items: center;
    padding: 90px 80px 100px; color: #0d2820;
  }
  .wordmark { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; }
  .dot { width: 14px; height: 14px; border-radius: 50%; background: #5fc9a0; }
  h1 { font-size: 88px; font-weight: 800; letter-spacing: -3px; margin: 48px 0 0 0; line-height: 0.98; }
  .hi { background: #5fc9a0; padding: 0 20px; border-radius: 16px; }
  .role { font-size: 30px; font-weight: 600; margin-top: 28px; }
  .tags { display: flex; gap: 10px; margin-top: 18px; }
  .tag { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border: 2px solid #5fc9a0; color: rgba(13,40,32,0.75); padding: 6px 16px; border-radius: 999px; }
  .qr-card { margin-top: 56px; background: #fff; border-radius: 40px; padding: 48px; box-shadow: 0 20px 60px rgba(13,40,32,0.18); border: 3px solid #5fc9a0; }
  .qr-card svg { width: 460px; height: 460px; display: block; }
  .scan-url { margin-top: 36px; font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 600; letter-spacing: -0.5px; }
  .tagline { font-size: 22px; color: rgba(13,40,32,0.7); margin-top: 14px; text-align: center; max-width: 760px; line-height: 1.5; }
</style></head><body>
  <div class="wordmark"><span class="dot"></span>tarabird.com</div>
  <h1><span class="hi">Tara Bird</span></h1>
  <div class="role">Engineering Manager @ Gusto</div>
  <div class="tags"><span class="tag">Builder</span><span class="tag">Consultant</span><span class="tag">Freelancer</span></div>
  <div class="qr-card">${qrSvg}</div>
  <div class="scan-url">tarabird.com/hi</div>
  <div class="tagline">Scan to save my contact, connect on LinkedIn, or see what I'm building.</div>
</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/wallet-card.png', fullPage: true });
await browser.close();
console.log('✓ wallet-card.png');
