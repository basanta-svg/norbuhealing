// Resizes the client's photos into web-ready JPGs with semantic names, and the logo PNGs into src/assets/logos.
import fs from 'node:fs';
import sharp from 'sharp';
const src = 'src/assets/images/website photos';
const out = 'src/assets/images';
const map = {
  'lobby': 'IMG_7307.JPG', 'reception': 'IMG_7302.JPG', 'restaurant': 'IMG_7334.JPG',
  'room-couple': 'C1E39A73-E259-4502-83D7-078F8921F0FE.png', 'room-twin': 'E5B46F71-779E-47BC-83C4-6C1FF56C0FE3.png', 'room-desk': 'IMG_1383.JPG',
  'bath-1': 'IMG_1365.JPG', 'bath-2': 'IMG_1368.JPG',
  'spa-bed': 'DSC00298.JPG', 'spa-room': 'DSC00304.JPG', 'spa-room-2': 'DSC00312.JPG', 'spa-twin': 'DSC00318.JPG', 'spa-twin-2': 'DSC00319.JPG', 'spa-window': 'received_767698355106623.jpeg',
  'therapist': 'Grey Modern Professional CV Resume.png',
  'salon-hall': 'IMG_8778.JPG', 'salon-floor': 'IMG_8787.JPG', 'salon-floor-2': 'IMG_8789.JPG', 'salon-chair': 'IMG_5597.JPG', 'salon-moon': 'IMG_5596.JPG', 'salon-chair-2': 'IMG_8819.JPG',
  'corridor': 'DSC00289.JPG', 'corridor-2': 'IMG_1347.JPG',
};
for (const [name, file] of Object.entries(map)) {
  await sharp(`${src}/${file}`).rotate().resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${name}.jpg`);
}
const lg = 'src/assets/images/logo/Norbu-Logos-PNG';
for (const variant of ['transparent', 'white']) {
  for (const f of fs.readdirSync(`${lg}/${variant}`)) {
    await sharp(`${lg}/${variant}/${f}`).resize({ width: 700 }).png({ compressionLevel: 9 }).toFile(`src/assets/logos/${variant}-${f}`);
  }
}
console.log('done');

// The supplied "white" PNGs are opaque white backgrounds; build real white-on-transparent logos for dark sections.
for (const f of fs.readdirSync(`${lg}/transparent`)) {
  const { data, info } = await sharp(`${lg}/transparent/${f}`).resize({ width: 700 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) { data[i] = data[i + 1] = data[i + 2] = 255; }
  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(`src/assets/logos/white-${f}`);
}
