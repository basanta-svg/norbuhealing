// Generates on-brand illustrated placeholders for image slots where no suitable free photo was found.
// Replace any of these files in src/assets/images with a real photo of the same name (keep the .jpg name).
import fs from 'node:fs';
import sharp from 'sharp';

const DIR = 'src/assets/images';
// [name, orientation, alt, palette, motif]
const PAL = {
  sage: ['#3E4939', '#647263', '#C9D8CB'],
  lav: ['#5B3B78', '#9B72BE', '#E6D8F0'],
  sand: ['#8A6F4D', '#C9AE87', '#F4E9D6'],
  dusk: ['#2A2236', '#7A4D9C', '#E7B98F'],
  mint: ['#4D6B5A', '#8DB09A', '#E0EEE4'],
};
const L = 'l', P = 'p', A = 'a';
const SLOTS = [
  ['hero-main', L, 'A calm spa treatment room (placeholder illustration)', 'dusk', 'window'],
  ['footer-bg', L, 'A dark, calm spa interior (placeholder illustration)', 'sage', 'window'],
  ['blog-himalaya', L, 'Calm mountains at dawn (placeholder illustration)', 'mint', 'mountain'],
  ['blog-bhutan-flags', L, 'Prayer flags (placeholder illustration)', 'sand', 'mountain'],
  ['about-story', L, 'The Norbu Healing studio (placeholder illustration)', 'sand', 'window'],
  ['insta-2', P, 'A calm spa corner (placeholder illustration)', 'lav', 'bowl'],

  ['hero-studio-interior', L, 'A calm, warmly lit yoga studio (placeholder illustration)', 'sand', 'window'],
  ['hero-arch-center', P, 'A figure meditating in lotus pose (placeholder illustration)', 'lav', 'lotus'],
  ['hero-arch-right', P, 'A figure in tree pose (placeholder illustration)', 'mint', 'tree'],
  ['values-interior', L, 'A quiet meditation hall (placeholder illustration)', 'sand', 'window'],
  ['service-vinyasa', P, 'A figure flowing through a vinyasa sequence (placeholder illustration)', 'sage', 'tree'],
  ['service-restorative', P, 'A restorative pose on a bolster (placeholder illustration)', 'lav', 'lotus'],
  ['service-breathwork', P, 'A figure practising breathwork (placeholder illustration)', 'mint', 'lotus'],
  ['service-prenatal', P, 'A gentle prenatal yoga pose (placeholder illustration)', 'dusk', 'lotus'],
  ['service-herbal', P, 'Himalayan herbs for herbal therapy (placeholder illustration)', 'sage', 'leaf'],
  ['why-us-arch', P, 'A calm yoga teacher (placeholder illustration)', 'lav', 'lotus'],
  ['why-us-frame', P, 'A person meditating in soft light (placeholder illustration)', 'sand', 'lotus'],
  ['video-banner', L, 'Two people practising yoga in a sunlit studio (placeholder illustration)', 'dusk', 'window'],
  ['event-sound', L, 'A sound bath with healing bowls (placeholder illustration)', 'lav', 'bowl'],
  ['event-retreat', L, 'A group on a meditation retreat (placeholder illustration)', 'mint', 'mountain'],
  ['testimonial-video-2', L, 'Hands pressed together in namaste (placeholder illustration)', 'sage', 'lotus'],
  ['blog-tea', L, 'A mindful cup of tea (placeholder illustration)', 'sand', 'bowl'],
  ['blog-mat', L, 'A rolled yoga mat (placeholder illustration)', 'lav', 'leaf'],
  ['blog-back', L, 'A yogi seen from behind (placeholder illustration)', 'mint', 'tree'],
  ['insta-1', P, 'A yoga pose in a white studio (placeholder illustration)', 'sand', 'tree'],
  ['insta-4', P, 'A dzong in Thimphu (placeholder illustration)', 'dusk', 'mountain'],
  ['insta-5', P, 'Candles and stones arranged for meditation (placeholder illustration)', 'lav', 'bowl'],
  ['about-team-2', P, 'Portrait placeholder for a meditation teacher', 'sage', 'person'],
  ['about-team-3', P, 'Portrait placeholder for a healer', 'lav', 'person'],
  ['about-team-4', P, 'Portrait placeholder for a Himalayan healer', 'sand', 'person'],
  ['avatar-1', A, 'Instructor portrait placeholder', 'lav', 'person'],
  ['avatar-2', A, 'Instructor portrait placeholder', 'sage', 'person'],
  ['avatar-3', A, 'Instructor portrait placeholder', 'sand', 'person'],
  ['avatar-4', A, 'Instructor portrait placeholder', 'mint', 'person'],
];

const motif = (m, w, h, c) => {
  const cx = w / 2, base = h * 0.78, s = Math.min(w, h);
  const stroke = `fill="none" stroke="${c}" stroke-width="${s * 0.006}" stroke-linecap="round" stroke-linejoin="round" opacity=".85"`;
  switch (m) {
    case 'lotus': {
      const r = s * 0.2;
      const petal = (a) => `<path ${stroke} transform="rotate(${a} ${cx} ${base})" d="M${cx} ${base} C ${cx - r * 0.45} ${base - r * 0.6}, ${cx - r * 0.3} ${base - r * 1.3}, ${cx} ${base - r * 1.6} C ${cx + r * 0.3} ${base - r * 1.3}, ${cx + r * 0.45} ${base - r * 0.6}, ${cx} ${base}Z"/>`;
      return [-60, -30, 0, 30, 60].map(petal).join('');
    }
    case 'tree': return `<path ${stroke} d="M${cx} ${base} V${base - s * 0.45} M${cx} ${base - s * 0.2} q${s * 0.12} -${s * 0.1} ${s * 0.18} -${s * 0.22} M${cx} ${base - s * 0.3} q-${s * 0.12} -${s * 0.1} -${s * 0.18} -${s * 0.2}"/><circle ${stroke} cx="${cx}" cy="${base - s * 0.55}" r="${s * 0.05}"/>`;
    case 'leaf': return [-30, 0, 30].map((a) => `<path ${stroke} transform="rotate(${a} ${cx} ${base})" d="M${cx} ${base} C ${cx - s * 0.1} ${base - s * 0.15}, ${cx - s * 0.08} ${base - s * 0.35}, ${cx} ${base - s * 0.45} C ${cx + s * 0.08} ${base - s * 0.35}, ${cx + s * 0.1} ${base - s * 0.15}, ${cx} ${base} M${cx} ${base} V${base - s * 0.4}"/>`).join('');
    case 'bowl': return `<path ${stroke} d="M${cx - s * 0.22} ${base - s * 0.12} q${s * 0.22} ${s * 0.3} ${s * 0.44} 0 Z"/><ellipse ${stroke} cx="${cx}" cy="${base - s * 0.12}" rx="${s * 0.22}" ry="${s * 0.03}"/><path ${stroke} d="M${cx - s * 0.1} ${base - s * 0.28} q${s * 0.1} -${s * 0.1} ${s * 0.2} 0 M${cx - s * 0.16} ${base - s * 0.38} q${s * 0.16} -${s * 0.14} ${s * 0.32} 0"/>`;
    case 'mountain': return `<path ${stroke} d="M${w * 0.05} ${base} L${w * 0.3} ${base - s * 0.3} L${w * 0.45} ${base - s * 0.15} L${w * 0.65} ${base - s * 0.42} L${w * 0.95} ${base}"/><circle ${stroke} cx="${w * 0.78}" cy="${h * 0.25}" r="${s * 0.06}"/>`;
    case 'window': return `<path ${stroke} d="M${cx - s * 0.2} ${base} V${base - s * 0.5} a${s * 0.2} ${s * 0.2} 0 0 1 ${s * 0.4} 0 V${base} Z M${cx} ${base - s * 0.7} V${base} M${cx - s * 0.2} ${base - s * 0.3} H${cx + s * 0.2}"/>`;
    case 'person': return `<circle ${stroke} cx="${cx}" cy="${h * 0.38}" r="${s * 0.14}"/><path ${stroke} d="M${cx - s * 0.3} ${h} q${s * 0.05} -${s * 0.35} ${s * 0.3} -${s * 0.35} q${s * 0.25} 0 ${s * 0.3} ${s * 0.35}"/>`;
  }
  return '';
};

const credits = JSON.parse(fs.readFileSync('src/data/image-credits.json', 'utf8'));
for (const [name, o, alt, pal, m] of SLOTS) {
  const [w, h] = o === L ? [1600, 1067] : o === P ? [1000, 1400] : [400, 400];
  const [c1, c2, c3] = PAL[pal];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
<radialGradient id="r" cx=".5" cy=".85" r=".7"><stop offset="0" stop-color="${c3}" stop-opacity=".55"/><stop offset="1" stop-color="${c3}" stop-opacity="0"/></radialGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#r)"/>
<circle cx="${w / 2}" cy="${h * 0.78}" r="${Math.min(w, h) * 0.46}" fill="none" stroke="${c3}" stroke-opacity=".25" stroke-width="2"/>
<circle cx="${w / 2}" cy="${h * 0.78}" r="${Math.min(w, h) * 0.34}" fill="none" stroke="${c3}" stroke-opacity=".3" stroke-width="2"/>
${motif(m, w, h, c3)}</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(`${DIR}/${name}.jpg`);
  credits[name] = { file: `src/assets/images/${name}.jpg`, alt, photographer: 'Generated for Norbu Healing', source: 'Placeholder illustration', license: 'Original work',
    url: '', note: 'Replace with a real photo of the same filename.' };
  console.log('gen', name);
}
// Photos that were poor matches are replaced above; drop their credit entries only if regenerated.
fs.writeFileSync('src/data/image-credits.json', JSON.stringify(credits, null, 2));
