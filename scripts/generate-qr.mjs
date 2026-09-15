import QRCode from 'qrcode';

const url = 'https://tarabird.com/hi';

await QRCode.toFile('public/hi-qr.svg', url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 4,
  color: { dark: '#000000', light: '#ffffff' },
});

await QRCode.toFile('public/hi-qr.png', url, {
  type: 'png',
  width: 1024,
  errorCorrectionLevel: 'M',
  margin: 4,
  color: { dark: '#000000ff', light: '#ffffffff' },
});

console.log(`✓ hi-qr.svg + hi-qr.png → ${url}`);
