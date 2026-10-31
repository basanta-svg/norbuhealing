import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const departmentEnum = z.enum(['Wellness', 'Salon', 'Hotel', 'Institute']);

// Offers & announcements. Add one .md file per active offer; remove or set `expires` to retire it.
// Nothing is hard-coded on the pages, so an empty folder shows a friendly "no current offers" note.
const offers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/offers' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    department: departmentEnum,
    kind: z.enum(['Seasonal promotion', 'Wellness package', 'Salon offer', 'Hotel package', 'Membership offer', 'Training announcement']),
    image: z.string().optional(),
    expires: z.coerce.date().optional(),
    order: z.number().default(99),
  }),
});

// Genuine reviews only, published with the reviewer's permission. The homepage section hides itself while this is empty.
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    department: departmentEnum,
    rating: z.number().min(1).max(5).default(5),
    order: z.number().default(99),
  }),
});

export const collections = { offers, testimonials };
