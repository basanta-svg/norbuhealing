import { activeOffers } from '../lib/offers';
import { site, departments, healingServices, salonGroups, rooms, dining, primaryCourses, additionalCourses } from '../data/site';

// Built once at build time and fetched by the header search the first time it is opened.
const svgs = import.meta.glob<string>('../icons/norbu-*.svg', { query: '?raw', import: 'default', eager: true });
const icon = (n: string) => svgs[`../icons/norbu-${n}.svg`] ?? '';

type Item = { t: string; a: string; x: string; h: string; i: string; k?: string };

export async function GET() {
  const offers = await activeOffers();
  const items: Item[] = [
    ...departments.map((d) => ({ t: d.name, a: 'Department', x: d.blurb, h: d.href, i: { healing: 'lotus', hotel: 'stay', salon: 'hair-salon', institute: 'courses' }[d.key], k: `${d.short} ${d.key} wellness spa hotel salon institute training` })),
    ...healingServices.map((s) => ({ t: s.title, a: 'Healing & Wellness', x: s.text, h: '/healing/#services', i: 'massage', k: 'spa massage therapy treatment relax bodywork pain stress' })),
    ...salonGroups.flatMap((g) => g.items.map((i) => ({ t: i, a: `Salon · ${g.title}`, x: g.text, h: '/salon/#services', i: g.title.startsWith('Skin') ? 'facial' : 'hair-salon', k: 'beauty hair skin grooming' }))),
    ...rooms.map((r) => ({ t: r.title, a: 'Hotel room', x: r.text, h: '/hotel/#rooms', i: 'stay', k: 'accommodation stay bed room night guest' })),
    ...dining.map((d) => ({ t: d.title, a: 'Dining', x: d.text, h: '/hotel/#dining', i: 'tea', k: 'food eat drink restaurant cafe bar menu meal' })),
    ...primaryCourses.map((c) => ({ t: c.title, a: 'Institute course', x: c.text, h: '/institute/#courses', i: 'courses', k: 'training learn study class career certificate' })),
    ...additionalCourses.map((c) => ({ t: c.title, a: 'Institute course', x: `${c.status}. Short professional course.`, h: '/institute/#courses', i: 'certificate', k: 'training learn study class career beauty' })),
    ...offers.map((o) => ({ t: o.data.title, a: `Offer · ${o.data.department}`, x: o.data.summary, h: '/offers/', i: 'gift-voucher', k: 'offer discount promotion package deal' })),
    { t: 'Book now', a: 'Page', x: 'Healing, hotel, salon and training enquiries.', h: '/book/', i: 'booking', k: 'booking reserve appointment enquiry schedule' },
    { t: 'Contact & directions', a: 'Page', x: `Phone numbers, email ${site.email}, address and map.`, h: '/contact/', i: 'phone', k: 'phone call email address location map directions where find' },
    { t: 'Opening hours', a: 'Page', x: `Open ${site.hours}. Confirm department hours when you enquire.`, h: '/contact/', i: 'hours', k: 'time open close schedule when' },
    { t: 'About Norbu Healing', a: 'Page', x: 'Our story, vision, mission, values and the five elements.', h: '/about/', i: 'wellbeing', k: 'story vision mission values philosophy five elements' },
    { t: 'Offers & announcements', a: 'Page', x: 'Seasonal promotions, packages and training announcements.', h: '/offers/', i: 'gift-voucher', k: 'offer promotion discount news' },
  ].map((o: any) => o);

  const used = [...new Set(items.map((i) => i.i))];
  const icons = Object.fromEntries(used.map((n) => [n, icon(n)]));
  icons['arrow-right'] = icon('arrow-right');
  return new Response(JSON.stringify({ items, icons }), { headers: { 'Content-Type': 'application/json' } });
}
