import fs from 'node:fs';
import sharp from 'sharp';
const dir = 'src/assets/images';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
const W = 200, H = 200, COLS = 8;
const rows = Math.ceil(files.length / COLS);
const comps = [];
for (let i = 0; i < files.length; i++) {
  const b = await sharp(`${dir}/${files[i]}`).resize(W, H, { fit: 'cover' }).toBuffer();
  const x = (i % COLS) * W, y = Math.floor(i / COLS) * (H + 18);
  comps.push({ input: b, left: x, top: y });
  const label = Buffer.from(`<svg width="${W}" height="18"><text x="2" y="13" font-size="11" fill="#000">${i}:${files[i].slice(0, 28)}</text></svg>`);
  comps.push({ input: label, left: x, top: y + H });
}
await sharp({ create: { width: W * COLS, height: rows * (H + 18), channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 70 }).toFile(process.argv[2]);
