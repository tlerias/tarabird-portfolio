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

Measured against local preview (`npm run preview`) on 2026-05-14:

| Category | Score |
|---|---|
| Performance | 99 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

## Deploy

Auto-deploys to `tarabird.com` on push to `main` (via Vercel).
