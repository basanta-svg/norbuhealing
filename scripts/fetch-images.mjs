// Downloads free-licensed images from Wikimedia Commons (Unsplash/Pexels block scripted access).
// Usage: node scripts/fetch-images.mjs  -> writes src/assets/images/*.jpg + src/data/image-credits.json
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('src/assets/images');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync('src/data', { recursive: true });
const UA = { 'User-Agent': 'NorbuHealingBuild/1.0 (basanta@abit.bt)' };
// slot: [query, orientation(l|p|any), alt]
const SLOTS = {
  'hero-studio-interior': ['yoga studio interior wooden floor', 'l', 'A calm, warmly lit yoga studio with a wooden floor'],
  'hero-arch-left': ['woman yoga pose outdoor', 'p', 'A woman holding a standing yoga pose outdoors'],
  'hero-arch-center': ['woman meditating lotus pose', 'p', 'A woman meditating in lotus pose'],
  'hero-arch-right': ['yoga tree pose sunset', 'p', 'A person balancing in tree pose at sunset'],
  'studio-group-yoga': ['group yoga class studio', 'l', 'A group practising yoga together in a studio'],
  'values-hands-mudra': ['hands mudra meditation', 'any', 'Hands resting in a meditation mudra'],
  'values-tall': ['yoga mountain sunrise', 'p', 'A yogi practising on a mountain ridge at sunrise'],
  'values-interior': ['meditation hall interior cushions', 'l', 'A quiet meditation hall with cushions'],
  'service-vinyasa': ['vinyasa yoga', 'p', 'A student flowing through a vinyasa sequence'],
  'service-private': ['yoga instructor teaching student', 'p', 'An instructor guiding a student one to one'],
  'service-restorative': ['restorative yoga bolster', 'p', 'A restorative yoga pose supported by a bolster'],
  'service-beginners': ['yoga beginners class', 'p', 'Beginners learning yoga basics in a class'],
  'service-breathwork': ['pranayama breathing meditation', 'p', 'A person practising breathwork'],
  'service-prenatal': ['prenatal yoga pregnant', 'p', 'A pregnant woman in a gentle prenatal yoga pose'],
  'service-sound-bowl': ['tibetan singing bowl', 'p', 'A Tibetan singing bowl used for sound healing'],
  'service-herbal': ['herbal medicine herbs tea', 'p', 'Dried Himalayan herbs for herbal therapy'],
  'why-us-arch': ['yoga teacher portrait', 'p', 'A calm yoga teacher'],
  'why-us-frame': ['yoga seated meditation sunlight', 'p', 'A person meditating in soft light'],
  'video-banner': ['two women yoga room', 'l', 'Two people practising yoga in a sunlit studio'],
  'event-wellness': ['yoga evening candles', 'l', 'An evening wellness gathering'],
  'event-sunset': ['yoga sunset beach', 'l', 'Yoga practice at sunset'],
  'event-sound': ['sound healing bowls', 'l', 'A sound bath with healing bowls'],
  'event-retreat': ['meditation retreat group', 'l', 'A group on a meditation retreat'],
  'booking-warrior': ['warrior pose yoga', 'p', 'Two people in warrior pose'],
  'testimonial-video-1': ['woman meditating home', 'l', 'A woman meditating at home'],
  'testimonial-video-2': ['namaste hands', 'l', 'Hands pressed together in namaste'],
  'blog-tea': ['tea ceremony mindfulness', 'l', 'A mindful cup of tea'],
  'blog-journal': ['journal writing pen notebook', 'l', 'A journal open beside a pen'],
  'blog-bhutan-flags': ['Bhutan prayer flags', 'l', 'Prayer flags fluttering in Bhutan'],
  'blog-himalaya': ['Himalaya mountains Bhutan valley', 'l', 'Misty Himalayan mountains in Bhutan'],
  'blog-mat': ['yoga mat rolled', 'l', 'A rolled yoga mat'],
  'blog-back': ['yoga back view', 'l', 'A yogi seen from behind'],
  'insta-1': ['yoga pose white studio', 'p', 'A yoga pose in a white studio'],
  'insta-2': ['Bhutan monastery Paro Taktsang', 'p', 'Paro Taktsang monastery in Bhutan'],
  'insta-3': ['lotus flower', 'p', 'A lotus flower'],
  'insta-4': ['Thimphu Bhutan dzong', 'p', 'A dzong in Thimphu'],
  'insta-5': ['meditation candles stones', 'p', 'Candles and stones arranged for meditation'],
  'footer-bg': ['Bhutan valley dusk mist', 'l', 'A dark misty Bhutan valley'],
  'about-team-1': ['yoga instructor portrait woman', 'p', 'Portrait of a yoga instructor'],
  'about-team-2': ['man meditation teacher portrait', 'p', 'Portrait of a meditation teacher'],
  'about-team-3': ['Bhutanese woman portrait', 'p', 'Portrait of a healer'],
  'about-team-4': ['Bhutanese man portrait monk', 'p', 'Portrait of a Himalayan healer'],
  'about-story': ['Bhutan landscape rice terraces', 'l', 'Terraced Bhutan landscape'],
  'avatar-1': ['smiling woman portrait', 'p', 'Instructor portrait'],
  'avatar-2': ['Asian woman portrait', 'p', 'Instructor portrait'],
  'avatar-3': ['man portrait smiling', 'p', 'Instructor portrait'],
  'avatar-4': ['Bhutanese girl portrait', 'p', 'Instructor portrait'],
};

const used = new Set();
const credits = {};
const strip = (s = '') => s.replace(/<[^>]+>/g, '').trim();

async function search(q) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({ action: 'query', generator: 'search', gsrsearch: `${q} filetype:bitmap`, gsrnamespace: 6, gsrlimit: 25,
    prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: 1600, format: 'json' }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: UA });
  const j = await r.json();
  return Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
}
const okLic = (m) => /^(cc0|cc[- ]by|cc[- ]by[- ]sa|public domain|pd)/i.test(m?.LicenseShortName?.value ?? '');

for (const [name, [q, ori, alt]] of Object.entries(SLOTS)) {
  const dest = path.join(OUT, `${name}.jpg`);
  let pages = await search(q);
  if (pages.length < 3) pages = pages.concat(await search(q.split(' ').slice(0, 2).join(' ')));
  const pick = pages.find((p) => {
    const i = p.imageinfo?.[0]; if (!i || used.has(p.pageid)) return false;
    if (!/jpeg|png/.test(i.mime)) return false;
    if (!okLic(i.extmetadata)) return false;
    if (i.width < 900 || i.height < 700) return false;
    const land = i.width >= i.height;
    if (ori === 'l' && !land) return false;
    if (ori === 'p' && land && i.width / i.height > 1.25) return false;
    return true;
  });
  if (!pick) { console.log('NO MATCH', name, q); continue; }
  used.add(pick.pageid);
  const i = pick.imageinfo[0];
  try {
    const buf = Buffer.from(await (await fetch(i.thumburl, { headers: UA })).arrayBuffer());
    await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(dest);
  } catch (e) { console.log('FAIL', name, e.message); continue; }
  const m = i.extmetadata;
  credits[name] = { file: `src/assets/images/${name}.jpg`, alt, photographer: strip(m.Artist?.value) || 'Unknown', source: 'Wikimedia Commons',
    license: m.LicenseShortName?.value, url: i.descriptionurl, title: pick.title };
  console.log('OK', name, '<-', pick.title);
  await new Promise((r) => setTimeout(r, 400));
}
fs.writeFileSync('src/data/image-credits.json', JSON.stringify(credits, null, 2));
