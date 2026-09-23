# tarabird.com

Personal portfolio. Built with Astro + Tailwind.

## Where things live

- **Design spec:** `docs/superpowers/specs/2026-05-14-tarabird-portfolio-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-05-14-tarabird-portfolio.md`
- **Components:** `src/components/`
- **Pages:** `src/pages/`
- **Content data:** `src/content/`

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Tests

```bash
npm test          # run unit tests once
npm run test:ui   # interactive vitest UI
```

## Lighthouse baseline

Measured against local preview (`npm run preview`) on 2026-09-23:

| Category | Score | 2026-05-14 |
|---|---|---|
| Performance | 93 | 99 |
| Accessibility | 96 | 95 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

The 2026-05-14 run is not a like-for-like comparison: its network log shows
`portrait.jpg` was never fetched, so the hero image — the page's largest
contentful paint — was not counted. The 2026-09-23 run measures a page where
everything renders. Total payload is nonetheless **lower** than that run
(781 KB against 1115 KB), after converting the build screenshots and the
portrait from PNG to JPEG and sizing the portrait to what it actually
renders at.

## Deploy

Auto-deploys to `tarabird.com` on push to `main` (via Vercel).
