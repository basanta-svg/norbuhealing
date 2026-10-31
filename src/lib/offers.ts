import { getCollection } from 'astro:content';

// Offers whose `expires` date has passed are hidden automatically at build time.
export async function activeOffers() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return (await getCollection('offers'))
    .filter((o) => !o.data.expires || o.data.expires >= today)
    .sort((a, b) => a.data.order - b.data.order);
}
