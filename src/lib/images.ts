import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,png}', { eager: true });

export function img(name: string): ImageMetadata {
  const hit = all[`/src/assets/images/${name}.jpg`] ?? all[`/src/assets/images/${name}.png`];
  if (!hit) throw new Error(`Missing image: ${name}`);
  return hit.default;
}

const alts: Record<string, string> = {
  lobby: 'The Norbu Healing lobby and lounge',
  reception: 'The Norbu Healing reception and lounge',
  restaurant: 'The Norbu Healing Restaurant dining hall',
  'room-couple': 'Deluxe Couple Room',
  'room-twin': 'Deluxe Twin Room',
  'room-desk': 'A guest room with writing desk',
  'bath-1': 'A hotel bathroom',
  'bath-2': 'A hotel bathroom with lit mirror',
  'spa-bed': 'A treatment room with warm red linens',
  'spa-room': 'A treatment room at the Healing Arts Centre',
  'spa-room-2': 'A treatment room with wooden panelling',
  'spa-twin': 'A twin treatment room',
  'spa-twin-2': 'A twin treatment room',
  'spa-window': 'A Bhutanese-style treatment room with a traditional rug',
  therapist: 'A therapist greeting a guest before a treatment',
  'salon-hall': 'The Norbu Healing Salon hall',
  'salon-floor': 'Styling stations at Norbu Healing Salon',
  'salon-floor-2': 'Styling stations at Norbu Healing Salon',
  'salon-chair': 'A styling chair at Norbu Healing Salon',
  'salon-chair-2': 'A styling chair at Norbu Healing Salon',
  'salon-moon': 'The Norbu Healing Salon entrance with a lit moon feature',
  corridor: 'A hotel corridor',
  'corridor-2': 'A hotel corridor',
};

export function altFor(name: string): string {
  return alts[name] ?? '';
}
