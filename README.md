# Norbu Healing website (Astro + Tailwind)

Front-end design for Norbu Healing: home, About, Healing, Hotel, Salon, Institute, Offers, Book and Contact.

## Run it on your computer
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview
```
Needs Node 22 or newer.

## Share a live preview on GitHub Pages
1. Create a repository on GitHub and push this folder to the `main` branch.
2. In the repository open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` now builds and publishes the site (see the **Actions** tab, about 2 minutes).
4. The link is `https://<your-github-username>.github.io/<repository-name>/`. A repository named `<username>.github.io` is served at `https://<username>.github.io/`.

The workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) works out the address by itself. The preview is marked `noindex`, so Google will not list it. When the site goes live on norbuhealing.com, build without `SITE` and `BASE` (plain `npm run build`) and upload `dist/`.

## Editing content
- **Contact details, navigation, departments, services, rooms, courses, WhatsApp number, hours:** `src/data/site.ts`. Items marked `CONFIRM` are waiting for the client.
- **Offers and testimonials:** Markdown files in `src/content/offers/` and `src/content/testimonials/` (schemas in `src/content.config.ts`). Both are empty for now; the sections hide themselves until there is something to show.
- **Photos:** web-sized copies live in `src/assets/images/` (one JPG per name used in the pages). Swap a file with the same name to change a photo.
- **Logos:** `src/assets/logos/`. **Icons:** `src/icons/` (Norbu icon set). **Brand guidelines:** `src/assets/brand guidelines/`.
- **Colours and fonts:** `src/styles/global.css` (Norbu Plum `#530035`, Plus Jakarta Sans, Cormorant Garamond).

## Forms
Booking, contact and enquiry forms post to `PUBLIC_FORM_ENDPOINT` (Formspree, Web3Forms, etc.). Create a `.env` file:
```
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```
With no endpoint set, forms validate and show a demo success message without sending anything (this is the case on the preview).

## Structure
`src/pages` (routes) · `src/components/{layout,sections,ui}` · `src/layouts/BaseLayout.astro` (SEO, fonts) · `src/scripts` (smooth scroll, search, chat, form pickers, reveal) · `scripts/` (helper scripts; `apply-base.mjs` runs after the build for GitHub Pages).

The original full-size client photos and logo exports are not stored in the repository. `scripts/import-photos.mjs` shows how the web-sized copies were made from them.
