import QRCode from 'qrcode';

const url = 'https://tarabird.com/card';

await QRCode.toFile('public/card-qr.svg', url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#0d2820', light: '#fef9f0' },
});

await QRCode.toFile('public/card-qr.png', url, {
  type: 'png',
  width: 1024,
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#0d2820ff', light: '#fef9f0ff' },
});

console.log(`✓ card-qr.svg + card-qr.png → ${url}`);
