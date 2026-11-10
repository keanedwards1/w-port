# Kean Edwards website

A static site built with Vite, React, and TypeScript, hosted on Vercel. Every page is written out as real HTML at build time, so search engines and AI tools can read it without running JavaScript. There is no server.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at http://localhost:5280 |
| `npm run build` | Type check, build, and write every page to `dist/client` |
| `npm test` | Unit tests, including the copy check |
| `npm run serve` | Serves the build like Vercel does, at http://localhost:5290 |
| `npm run qa` | Opens every page in Chrome at 4 widths. Needs `npm run serve` running |
| `npm run qa:flows` | Tests menus, forms, and tools in Chrome. Needs `npm run serve` running |
| `npm run images` | Rebuilds images from your source photos and screenshots |
| `npm run capture` | Retakes full-page screenshots of client sites |

## Where to change things

| To change | Edit |
|---|---|
| Phone, email, hours, form address, booking link, social links | `src/data/site.ts` |
| Prices | `src/data/prices.ts` |
| Offers and the banner | `src/data/offers.ts` |
| Menus (header, phone menu, and footer all read this) | `src/data/nav.ts` |
| Services | `src/data/services.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Testimonials (delete an entry to remove it everywhere) | `src/data/testimonials.ts` |
| "What's wrong?" list | `src/data/problems.ts` |
| FAQ, guides, job steps | `src/data/faqs.ts`, `guides.ts`, `process.ts` |
| Colors, spacing, motion timing | `src/styles/tokens.css` |

Offers switch themselves off after their end date. To add a real Google before-and-after, put two screenshots in `public/images/google-profile/` and set `before` and `after` in `src/data/site.ts`. The slider then turns on.

## Deploying

1. Import this folder in Vercel, or run `vercel`. The settings are already in `vercel.json`.
2. Set `VITE_SITE_URL` to your real domain. It sets canonical URLs, the sitemap, and social cards.
3. Turn on Web Analytics in the Vercel project settings.
4. Optional: set `VITE_PSI_API_KEY` to add Google speed scores to the Site Check. See `.env.example`.

## Site Check data sources

All of these run in the visitor's browser, and each one can fail without affecting the others.

| Source | Gives | Key needed |
|---|---|---|
| Google Public DNS | Email records and hosting clues | No |
| rdap.org | Domain age and renewal date | No |
| Microlink | Title, description, phone screenshot | No. The free tier is limited per visitor |
| Google PageSpeed | Speed and quality scores | Yes in practice. The keyless quota returned 429 when tested |
