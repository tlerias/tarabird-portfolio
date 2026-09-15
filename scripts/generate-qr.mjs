import QRCode from 'qrcode';

const url = 'https://tarabird.com/hi';

await QRCode.toFile('public/hi-qr.svg', url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#0d2820', light: '#fef9f0' },
});

await QRCode.toFile('public/hi-qr.png', url, {
  type: 'png',
  width: 1024,
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#0d2820ff', light: '#fef9f0ff' },
});

console.log(`✓ hi-qr.svg + hi-qr.png → ${url}`);
