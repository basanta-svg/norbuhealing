// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// On GitHub Pages the workflow sets SITE (https://<user>.github.io) and BASE (/<repo>/). Locally and on a custom
// domain both are left unset, so the site builds for the root of norbuhealing.com.
const site = process.env.SITE || 'https://norbuhealing.com';
const base = process.env.BASE || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [sitemap(), icon()],
  // Suggested URLs from the content brief that map onto sections of the department pages.
  redirects: {
    '/courses': '/institute/#courses',
    '/rooms': '/hotel/#rooms',
    '/booking': '/book/',
    '/search': '/',
  },
  vite: { plugins: [tailwindcss()] },
});
