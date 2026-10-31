// Finds hero-image candidates on Wikimedia Commons and writes numbered previews + a manifest to an output dir.
import fs from 'node:fs';
import sharp from 'sharp';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const UA = { 'User-Agent': 'NorbuHealingBuild/1.0 (basanta@abit.bt)' };
const queries = ['yoga hall interior', 'meditation room interior', 'zen garden temple interior wood', 'Bhutan dzong courtyard', 'Bhutan monastery interior', 'Himalaya sunrise peaks', 'Bhutan Paro valley', 'Punakha dzong', 'lotus pond sunrise', 'bamboo forest path mist', 'Buddhist temple prayer hall', 'Thimphu Tashichho Dzong'];
const manifest = [];
let n = 0;
for (const q of queries) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({ action: 'query', generator: 'search', gsrsearch: `${q} filetype:bitmap`, gsrnamespace: 6, gsrlimit: 12, prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: 1600, format: 'json' }).forEach(([k, v]) => u.searchParams.set(k, v));
  const j = await (await fetch(u, { headers: UA })).json();
  for (const p of Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index)) {
    const i = p.imageinfo?.[0];
    if (!i || !/jpeg/.test(i.mime) || i.width < 1800 || i.width / i.height < 1.3) continue;
    if (!/^(cc0|cc[- ]by|public domain|pd)/i.test(i.extmetadata?.LicenseShortName?.value ?? '')) continue;
    try {
      const buf = Buffer.from(await (await fetch(i.thumburl, { headers: UA })).arrayBuffer());
      await sharp(buf).rotate().resize({ width: 1600 }).jpeg({ quality: 82 }).toFile(`${out}/c${n}.jpg`);
      manifest.push({ n, q, title: p.title, lic: i.extmetadata.LicenseShortName.value, artist: (i.extmetadata.Artist?.value ?? '').replace(/<[^>]+>/g, ''), url: i.descriptionurl });
      n++;
    } catch {}
    if (n % 3 === 0) break;
  }
  await new Promise((r) => setTimeout(r, 300));
}
fs.writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
const W = 300, H = 200, C = 6, rows = Math.ceil(manifest.length / C), comps = [];
for (const m of manifest) {
  const x = (m.n % C) * W, y = Math.floor(m.n / C) * (H + 16);
  comps.push({ input: await sharp(`${out}/c${m.n}.jpg`).resize(W, H, { fit: 'cover' }).toBuffer(), left: x, top: y });
  comps.push({ input: Buffer.from(`<svg width="${W}" height="16"><text x="2" y="12" font-size="12" fill="#000">${m.n}: ${m.title.slice(5, 34).replace(/&/g, '')}</text></svg>`), left: x, top: y + H });
}
await sharp({ create: { width: W * C, height: rows * (H + 16), channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 72 }).toFile(`${out}/sheet.jpg`);
console.log(manifest.length, 'candidates');
