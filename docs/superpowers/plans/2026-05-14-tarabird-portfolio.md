# tarabird.com Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy `tarabird.com` — a long-scroll Astro portfolio site with three case study subpages — per the design spec at `/Users/tarabird/Workspace/portfolio/docs/superpowers/specs/2026-05-14-tarabird-portfolio-design.md`.

**Architecture:** Astro 5 static site, Tailwind 4 styling, MDX for long-form content, self-hosted Inter + JetBrains Mono. Zero client-side framework runtime. JS only where it has to be: marquee, scroll observer, konami code, contact form. Deployed to Vercel with a custom serverless function handling the contact form.

**Tech Stack:** Astro 5 · Tailwind CSS 4 · MDX · TypeScript · Vitest (logic tests only) · Vercel (host + serverless) · `@fontsource-variable` packages · Zod (content schema validation)

**Working directory:** `/Users/tarabird/Workspace/portfolio`

---

## Phase 1 — Project setup

### Task 1: Initialize the Astro project

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/package.json`
- Create: `/Users/tarabird/Workspace/portfolio/astro.config.mjs`
- Create: `/Users/tarabird/Workspace/portfolio/tsconfig.json`
- Create: `/Users/tarabird/Workspace/portfolio/.gitignore`
- Create: `/Users/tarabird/Workspace/portfolio/README.md`

- [ ] **Step 1: Confirm working directory**

Run: `cd /Users/tarabird/Workspace/portfolio && ls`
Expected: shows `docs/` and `.superpowers/` (from brainstorm phase). Confirms we're in the right place.

- [ ] **Step 2: Initialize git**

Run: `cd /Users/tarabird/Workspace/portfolio && git init && git branch -M main`
Expected: `Initialized empty Git repository...`

- [ ] **Step 3: Create the Astro project in-place**

Run from `/Users/tarabird/Workspace/portfolio`:
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston
```
When prompted "directory not empty", answer yes to continue.

- [ ] **Step 4: Install Astro + integrations**

```bash
npm install astro@latest
npm install @astrojs/mdx @astrojs/tailwind @astrojs/sitemap @astrojs/vercel
npm install -D tailwindcss@latest @tailwindcss/vite
npm install @fontsource-variable/inter @fontsource-variable/jetbrains-mono
npm install zod
npm install -D vitest @vitest/ui
```

- [ ] **Step 5: Update `astro.config.mjs`**

Replace the file contents with:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://tarabird.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
```

- [ ] **Step 6: Update `.gitignore`**

Append:
```
.DS_Store
.env
.env.local
.vercel/
.astro/
dist/
node_modules/
.superpowers/brainstorm/*/
!.superpowers/brainstorm/*/README.md
```

- [ ] **Step 7: Create top-level README.md**

```markdown
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

## Deploy

Auto-deploys to `tarabird.com` on push to `main` (via Vercel).
```

- [ ] **Step 8: Verify the dev server boots**

Run: `npm run dev`
Expected: server starts on http://localhost:4321 with the default minimal Astro page. Stop with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: initialize Astro project with Tailwind, MDX, Vercel adapter"
```

---

### Task 2: Define design tokens

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/styles/tokens.css`
- Create: `/Users/tarabird/Workspace/portfolio/tailwind.config.mjs`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
@import '@fontsource-variable/inter';
@import '@fontsource-variable/jetbrains-mono';
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  /* Color tokens — see spec §3 */
  --color-cream: #fef9f0;
  --color-cream-warm: #fefcf5;
  --color-peach-wash: #fdf0e8;
  --color-lavender-wash: #f3eef8;
  --color-lavender: #8b7ab8;
  --color-lavender-deep: #5b4380;
  --color-mint: #5fc9a0;
  --color-forest: #1a4a3a;
  --color-ink: #0d2820;
  --color-ink-soft: #1a3a2e;
  --color-card-border: #d4cfc1;

  /* Gradients */
  --gradient-hero: linear-gradient(165deg, #fdf6f0 0%, #fdf6f0 40%, #f3eef8 100%);
  --gradient-career: linear-gradient(180deg, #f3eef8, #ede5f5);
  --gradient-personal: linear-gradient(180deg, #fef9f0, #fdf0e8);

  /* Font stacks */
  --font-display: 'Inter Variable', Inter, system-ui, -apple-system, sans-serif;
  --font-body: 'Inter Variable', Inter, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono Variable', 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

html {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Create `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        'cream-warm': 'var(--color-cream-warm)',
        'peach-wash': 'var(--color-peach-wash)',
        'lavender-wash': 'var(--color-lavender-wash)',
        lavender: 'var(--color-lavender)',
        'lavender-deep': 'var(--color-lavender-deep)',
        mint: 'var(--color-mint)',
        forest: 'var(--color-forest)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'card-border': 'var(--color-card-border)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      letterSpacing: {
        'tightest-display': '-0.04em',
        'tight-display': '-0.025em',
      },
    },
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css tailwind.config.mjs
git commit -m "feat(design): add color, typography, gradient tokens"
```

---

### Task 3: Create the base layout

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/layouts/Base.astro`

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/tokens.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'Tara Bird — I build cool & useful things.',
  description = 'Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, and a tap-and-knock game for my kids.',
  ogImage = '/og-image.png',
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<!-- Built by Tara Bird. If you're poking around in here, say hi: https://tarabird.com#say-hi -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site)} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body class="font-body bg-cream text-ink">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Replace the existing `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <main class="p-8">
    <h1 class="font-display text-5xl font-extrabold tracking-tight-display">
      tarabird scaffold
    </h1>
    <p class="font-mono text-xs uppercase tracking-widest text-lavender mt-2">
      hello world — design tokens are wired
    </p>
  </main>
</Base>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Open: `http://localhost:4321`
Expected: heading in Inter 800, tracking-tight; mono lavender subhead. Page background = cream. View source: HTML comment signature is at the top of the document.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat(layout): add Base layout with meta, signature, font wiring"
```

---

### Task 4: Set up Vitest for logic tests

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/vitest.config.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/__tests__/sanity.test.ts`
- Modify: `/Users/tarabird/Workspace/portfolio/package.json` (add scripts)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
```

- [ ] **Step 2: Add npm scripts to `package.json`**

Add to the `"scripts"` block:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 3: Write a sanity test**

Create `src/lib/__tests__/sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json src/lib/__tests__/sanity.test.ts
git commit -m "test: add vitest for logic tests"
```

---

*Continued in next sections. Phases 2–10 cover: atomic components, layout/structural components, homepage sections, case studies, easter eggs, content/screenshots, form backend, SEO, deploy.*

---

## Phase 2 — Atomic components


### Task 5: Squiggle SVG component

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Squiggle.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  color?: 'mint' | 'lavender';
  width?: number;
}
const { color = 'mint', width = 170 } = Astro.props;
const stroke = color === 'mint' ? 'var(--color-mint)' : 'var(--color-lavender)';
---
<svg
  width={width}
  height="14"
  viewBox={`0 0 ${width} 14`}
  aria-hidden="true"
  class="block"
>
  <path
    d={`M2 8 Q ${width * 0.18} 2, ${width * 0.35} 8 T ${width * 0.7} 8 T ${width - 2} 8`}
    stroke={stroke}
    stroke-width="3"
    fill="none"
    stroke-linecap="round"
    class="squiggle-path"
  />
</svg>
<style>
  .squiggle-path {
    stroke-dasharray: 500;
    stroke-dashoffset: 0;
  }
</style>
```

- [ ] **Step 2: Verify visually**

Add temporarily to `src/pages/index.astro` below the heading:
```astro
import Squiggle from '../components/Squiggle.astro';
// ... in markup:
<Squiggle color="mint" width={170} />
<Squiggle color="lavender" width={220} />
```

Run: `npm run dev`. Expected: two squiggles render, mint then lavender, different widths.

Remove the demo lines from `index.astro` before committing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Squiggle.astro
git commit -m "feat(components): add Squiggle SVG underline"
```

---

### Task 6: Highlight component (color-block on a word)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Highlight.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  color?: 'mint' | 'lavender';
}
const { color = 'mint' } = Astro.props;
const classes = color === 'mint'
  ? 'bg-mint text-ink'
  : 'bg-lavender text-cream';
---
<span class={`px-2.5 rounded-lg ${classes}`} style="padding-inline:10px;border-radius:8px">
  <slot />
</span>
```

- [ ] **Step 2: Verify**

In `src/pages/index.astro`, add a test:
```astro
import Highlight from '../components/Highlight.astro';
// in markup:
<h1 class="font-display text-6xl font-extrabold mt-8">
  I build <Highlight color="mint">cool</Highlight> &amp; <Highlight color="lavender">useful</Highlight> things.
</h1>
```

Run dev. Expected: highlighted "cool" in mint with dark ink text, "useful" in lavender with cream text. Padding looks right. Remove demo lines before commit.

- [ ] **Step 3: Commit**

```bash
git add src/components/Highlight.astro
git commit -m "feat(components): add Highlight color-block component"
```

---

### Task 7: Button component (Primary / Secondary pill)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Button.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'mint';
  size?: 'sm' | 'md';
  external?: boolean;
}
const { href, variant = 'primary', size = 'md', external = false } = Astro.props;

const base = 'inline-block font-semibold rounded-full transition-transform duration-150 hover:-translate-y-px';
const sizeClass = size === 'sm' ? 'px-4 py-2 text-xs' : 'px-5 py-3 text-sm';
const variantClass = {
  primary: 'bg-ink text-cream hover:bg-forest',
  secondary: 'border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cream',
  mint: 'bg-mint text-ink hover:brightness-95',
}[variant];

const classes = `${base} ${sizeClass} ${variantClass}`;
const target = external ? '_blank' : undefined;
const rel = external ? 'noopener noreferrer' : undefined;
---
{href ? (
  <a href={href} target={target} rel={rel} class={classes}>
    <slot />
  </a>
) : (
  <button class={classes} type="submit">
    <slot />
  </button>
)}
```

- [ ] **Step 2: Verify**

Add to `index.astro` temporarily:
```astro
import Button from '../components/Button.astro';
// in markup:
<div class="flex gap-3 mt-4">
  <Button variant="primary" href="#">See the builds →</Button>
  <Button variant="secondary" href="#">Say hi</Button>
  <Button variant="mint" href="#">Send →</Button>
</div>
```

Run dev. Hover each, confirm lift + color shift. Remove demo lines before commit.

- [ ] **Step 3: Commit**

```bash
git add src/components/Button.astro
git commit -m "feat(components): add Button (primary/secondary/mint pill variants)"
```

---

### Task 8: StatusPill component

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/StatusPill.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  variant?: 'live' | 'kids' | 'wip';
  label?: string;
}
const { variant = 'live', label } = Astro.props;
const defaults = { live: 'LIVE', kids: 'FOR THE KIDS', wip: 'WIP' };
const text = label ?? defaults[variant];
const variantClass = {
  live: 'bg-mint text-ink',
  kids: 'bg-lavender text-cream',
  wip: 'bg-cream-warm text-ink border border-ink',
}[variant];
---
<span class={`inline-block font-mono text-[9px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${variantClass}`}>
  {text}
</span>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusPill.astro
git commit -m "feat(components): add StatusPill (live/kids/wip variants)"
```

---

### Task 9: SectionHeader component (mono label + title + squiggle)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/SectionHeader.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Squiggle from './Squiggle.astro';

interface Props {
  number: string;        // "01"
  label: string;         // "builds"
  squiggleColor?: 'mint' | 'lavender';
  squiggleWidth?: number;
  labelColor?: 'lavender' | 'lavender-deep' | 'mint';
}
const {
  number,
  label,
  squiggleColor = 'mint',
  squiggleWidth = 170,
  labelColor = 'lavender',
} = Astro.props;

const labelClass = {
  'lavender': 'text-lavender',
  'lavender-deep': 'text-lavender-deep',
  'mint': 'text-mint',
}[labelColor];
---
<div>
  <div class={`font-mono text-[10px] font-semibold uppercase tracking-[2px] ${labelClass}`}>
    {number} — {label}
  </div>
  <h2 class="font-display font-extrabold text-[46px] md:text-[48px] leading-none tracking-tight-display mt-2">
    <slot />
  </h2>
  <div class="mt-1">
    <Squiggle color={squiggleColor} width={squiggleWidth} />
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHeader.astro
git commit -m "feat(components): add SectionHeader (label + title + squiggle)"
```

---

### Task 10: BlurShape component (decorative organic gradient)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/BlurShape.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  size?: number;
  opacity?: number;
  position?: string;      // any CSS positioning, e.g. "top:80px;right:-40px"
  colors?: [string, string];
}
const {
  size = 240,
  opacity = 0.18,
  position = 'top:80px;right:-40px',
  colors = ['var(--color-mint)', 'var(--color-lavender)'],
} = Astro.props;
const bg = `radial-gradient(${colors[0]}, ${colors[1]})`;
const style = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${bg};opacity:${opacity};filter:blur(40px);${position};pointer-events:none;z-index:0`;
---
<div aria-hidden="true" style={style}></div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BlurShape.astro
git commit -m "feat(components): add BlurShape decorative gradient"
```

---

## Phase 3 — Layout & structural components

### Task 11: Content schemas (Zod) + content data files

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/content/schema.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/content/now.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/content/builds.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/content/off-keyboard.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/content/off-the-clock.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/content/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test first (TDD)**

Create `src/content/__tests__/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { now } from '../now';
import { builds } from '../builds';
import { offKeyboard } from '../off-keyboard';
import { offTheClock } from '../off-the-clock';
import { NowSchema, BuildSchema, OffKeyboardSchema, OffTheClockSchema } from '../schema';
import { z } from 'zod';

describe('content data', () => {
  it('now items match schema', () => {
    expect(() => z.array(NowSchema).parse(now)).not.toThrow();
    expect(now.length).toBeGreaterThanOrEqual(3);
  });

  it('builds match schema', () => {
    expect(() => z.array(BuildSchema).parse(builds)).not.toThrow();
    expect(builds.length).toBe(3);
    const slugs = builds.map(b => b.slug);
    expect(slugs).toEqual(['severance', 'rollcall', 'knock-it-off']);
  });

  it('off-keyboard items match schema', () => {
    expect(() => z.array(OffKeyboardSchema).parse(offKeyboard)).not.toThrow();
    expect(offKeyboard.length).toBe(2);
  });

  it('off-the-clock items match schema', () => {
    expect(() => z.array(OffTheClockSchema).parse(offTheClock)).not.toThrow();
    expect(offTheClock.length).toBe(4);
  });
});
```

- [ ] **Step 2: Run the test, confirm it fails**

Run: `npm test`
Expected: failures — schemas and content files don't exist yet.

- [ ] **Step 3: Create the schema**

`src/content/schema.ts`:
```ts
import { z } from 'zod';

export const NowSchema = z.string().min(1);

export const BuildSchema = z.object({
  slug: z.enum(['severance', 'rollcall', 'knock-it-off']),
  title: z.string(),
  oneLine: z.string(),
  description: z.string(),
  dates: z.string(),
  liveUrl: z.string().url(),
  liveLabel: z.string(),  // "Visit ↗" or "Play ↗"
  status: z.enum(['live', 'kids']),
  screenshot: z.string(),
  gradientHeader: z.string(),
});

export const OffKeyboardSchema = z.object({
  title: z.string(),
  meta: z.string(),
  description: z.string(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).length(3),
  link: z.string().url().optional(),
});

export const OffTheClockSchema = z.object({
  title: z.string(),
  body: z.string(),
});
```

- [ ] **Step 4: Create `src/content/now.ts`**

```ts
export const now: string[] = [
  '▶ NOW SHIPPING gusto pro integrations',
  'rolling at north south jiu jitsu',
  'waiting for the caterpillars to hatch',
  're-reading "a wizard of earthsea"',
];
```

- [ ] **Step 5: Create `src/content/builds.ts`**

```ts
import type { z } from 'zod';
import type { BuildSchema } from './schema';

type Build = z.infer<typeof BuildSchema>;

export const builds: Build[] = [
  {
    slug: 'severance',
    title: 'Layoff Calculator',
    oneLine: 'A free, source-cited tool that grades severance offers.',
    description: 'A free, source-cited tool that grades severance offers and estimates runway in sixty seconds.',
    dates: '2024 → ongoing',
    liveUrl: 'https://layoffcalculator.com',
    liveLabel: 'Visit ↗',
    status: 'live',
    screenshot: '/screenshots/severance-hero.png',
    gradientHeader: 'linear-gradient(135deg, #0d2820 0%, #1a4a3a 100%)',
  },
  {
    slug: 'rollcall',
    title: 'Rollcall',
    oneLine: 'A training log and community for jiu-jitsu practitioners.',
    description: 'A training log and community for jiu-jitsu practitioners. Tracks belts, drills, and the people you roll with.',
    dates: '2025 → ongoing',
    liveUrl: 'https://www.meetwithrollcall.com/u/tara',
    liveLabel: 'Visit ↗',
    status: 'live',
    screenshot: '/screenshots/rollcall-profile.png',
    gradientHeader: 'linear-gradient(135deg, #fef9f0 0%, #f3eef8 100%)',
  },
  {
    slug: 'knock-it-off',
    title: 'Knock It Off',
    oneLine: 'A tap-and-knock game where a cat shoves food off the counter.',
    description: 'A tap-and-knock game where a cat shoves food off the counter to a hungry dog. Built in Godot, mostly for my kids.',
    dates: '2025 · live',
    liveUrl: 'https://knock-it-off.vercel.app',
    liveLabel: 'Play ↗',
    status: 'kids',
    screenshot: '/screenshots/knock-it-off-cat-select.png',
    gradientHeader: 'linear-gradient(180deg, #8a6f5a 0%, #5b3a2a 100%)',
  },
];
```

- [ ] **Step 6: Create `src/content/off-keyboard.ts`**

```ts
import type { z } from 'zod';
import type { OffKeyboardSchema } from './schema';

type OffKeyboard = z.infer<typeof OffKeyboardSchema>;

export const offKeyboard: OffKeyboard[] = [
  {
    title: 'Heart & Hammer',
    meta: '501(c)(3) · 2012 → today',
    description: 'A nonprofit my family started for community partnerships and humanitarian giving across NY, NJ, FL, and the Philippines.',
    stats: [
      { value: '5,000+', label: 'care packages' },
      { value: '13 yrs', label: 'continuous' },
      { value: '4', label: 'regions served' },
    ],
    link: 'https://heartandhammer.org',
  },
  {
    title: 'Kinetic Minds',
    meta: 'kid-coding pilot · 2024 → 2025',
    description: 'A creative-coding program for 3rd–5th graders in Montclair. Started with a community fundraiser.',
    stats: [
      { value: '$3,750', label: 'seed raised' },
      { value: '30%', label: 'sponsored seats' },
      { value: '6 mo', label: 'ran' },
    ],
    link: 'https://www.kineticmindscreative.com',
  },
];
```

- [ ] **Step 7: Create `src/content/off-the-clock.ts`**

```ts
import type { z } from 'zod';
import type { OffTheClockSchema } from './schema';

type Item = z.infer<typeof OffTheClockSchema>;

export const offTheClock: Item[] = [
  {
    title: 'Jiu-jitsu.',
    body: 'White belt, a year in. I eat my own dog food by tracking every roll on Rollcall.',
  },
  {
    title: 'Gardening.',
    body: 'Slowly turning the yard into something the kids can dig in.',
  },
  {
    title: 'Caterpillar habitats.',
    body: 'Backyard butterfly releases with the three short people I share a roof with.',
  },
  {
    title: 'Snowboarding & hiking.',
    body: 'CU Boulder ruined me forever (in a good way).',
  },
];
```

- [ ] **Step 8: Run the test, confirm it passes**

Run: `npm test`
Expected: all 4 content tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/content/
git commit -m "feat(content): add schemas + content data with validation tests"
```

---

### Task 12: Nav component

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Nav.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Button from './Button.astro';
const links = [
  { href: '#builds', label: 'Builds' },
  { href: '#career', label: 'Career' },
  { href: '#off-the-clock', label: 'Off the clock' },
];
---
<nav class="sticky top-0 z-50 backdrop-blur bg-cream/85 border-b border-card-border/40">
  <div class="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
    <a href="/" class="flex items-center gap-2 group">
      <span class="w-2.5 h-2.5 rounded-full bg-mint transition-colors group-hover:bg-lavender"></span>
      <span class="font-display font-bold text-[15px] tracking-tight-display">tarabird</span>
    </a>
    <div class="flex gap-5 items-center text-[13px] font-medium">
      {links.map(l => (
        <a href={l.href} class="hover:text-mint transition-colors hidden sm:inline">{l.label}</a>
      ))}
      <Button href="#say-hi" variant="primary" size="sm">Say hi →</Button>
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Wire into Base layout**

Modify `src/layouts/Base.astro` body section:
```astro
<body class="font-body bg-cream text-ink">
  <slot name="nav">
    <!-- pages can provide a custom nav via slot, otherwise default below -->
  </slot>
  <slot />
</body>
```

Actually, simpler: just import Nav directly in `index.astro` instead. Leave Base unchanged.

- [ ] **Step 3: Use it in index.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
---
<Base>
  <Nav />
  <main class="p-8">scaffold</main>
</Base>
```

- [ ] **Step 4: Verify**

Run dev. Expected: sticky nav with cream/blur background, wordmark left with mint dot, anchor links + "Say hi →" pill right.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat(components): add sticky Nav"
```

---

### Task 13: Marquee component (TDD for config logic)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/marquee.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/__tests__/marquee.test.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Marquee.astro`

- [ ] **Step 1: Write failing tests**

`src/lib/__tests__/marquee.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { interleaveSeparator, doubleForLoop } from '../marquee';

describe('marquee helpers', () => {
  it('interleaves a separator between items', () => {
    const result = interleaveSeparator(['a', 'b', 'c'], '★');
    expect(result).toEqual(['a', '★', 'b', '★', 'c', '★']);
  });

  it('handles single item', () => {
    expect(interleaveSeparator(['only'], '★')).toEqual(['only', '★']);
  });

  it('handles empty list', () => {
    expect(interleaveSeparator([], '★')).toEqual([]);
  });

  it('doubles items for seamless loop', () => {
    const items = ['a', 'b'];
    expect(doubleForLoop(items)).toEqual(['a', 'b', 'a', 'b']);
  });
});
```

- [ ] **Step 2: Run, confirm failure**

Run: `npm test`. Expected: failures — module not found.

- [ ] **Step 3: Implement the helpers**

`src/lib/marquee.ts`:
```ts
export function interleaveSeparator(items: string[], sep: string): string[] {
  const out: string[] = [];
  for (const item of items) {
    out.push(item, sep);
  }
  return out;
}

export function doubleForLoop<T>(items: T[]): T[] {
  return [...items, ...items];
}
```

- [ ] **Step 4: Run tests, confirm pass**

Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Build the Astro component**

`src/components/Marquee.astro`:
```astro
---
import { now } from '../content/now';
import { interleaveSeparator, doubleForLoop } from '../lib/marquee';

const interleaved = interleaveSeparator(now, '★');
const looped = doubleForLoop(interleaved);
---
<div class="w-full overflow-hidden bg-mint text-ink py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[1.5px] select-none">
  <div class="marquee-track whitespace-nowrap inline-block hover:[animation-play-state:paused]">
    {looped.map(s => (
      <span class="px-6">{s}</span>
    ))}
  </div>
</div>
<style>
  .marquee-track {
    animation: marquee 30s linear infinite;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/marquee.ts src/lib/__tests__/marquee.test.ts src/components/Marquee.astro
git commit -m "feat(components): add Marquee with looped scroll + tested helpers"
```

---

### Task 14: Footer component

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Footer.astro`

- [ ] **Step 1: Create the component**

```astro
---
const year = new Date().getFullYear();
---
<footer class="bg-ink text-cream/60 border-t border-ink-soft">
  <div class="max-w-6xl mx-auto flex justify-between items-center px-8 py-4 font-mono text-[10px]">
    <span>© {year} tarabird</span>
    <span>built with Astro · v.0.1</span>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(components): add Footer"
```

---

## Phase 4 — Homepage sections

### Task 15: Hero section

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/Hero.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Button from './Button.astro';
import Highlight from './Highlight.astro';
import Squiggle from './Squiggle.astro';
import BlurShape from './BlurShape.astro';
---
<section class="relative overflow-hidden" style="background:var(--gradient-hero)">
  <BlurShape size={280} opacity={0.18} position="top:80px;right:-60px" />
  <div class="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-14">
    <div class="font-mono text-[10px] font-semibold uppercase tracking-[2px] flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-mint"></span> hi, i'm tara
    </div>

    <h1 class="font-display font-extrabold text-[78px] leading-[0.96] tracking-tightest-display mt-5 max-w-3xl">
      I build<br />
      <Highlight color="mint">cool</Highlight> &amp; <Highlight color="lavender">useful</Highlight><br />
      things.
    </h1>

    <div class="mt-1">
      <Squiggle color="mint" width={280} />
    </div>

    <p class="text-[17px] leading-[1.6] mt-6 max-w-xl text-ink/90">
      Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, and a tap-and-knock game for my kids.
    </p>

    <div class="flex gap-3 mt-7">
      <Button href="#builds" variant="primary">See the builds →</Button>
      <Button href="#say-hi" variant="secondary">Say hi</Button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Use it on the homepage**

Modify `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Marquee from '../components/Marquee.astro';
import Footer from '../components/Footer.astro';
---
<Base>
  <Nav />
  <main>
    <Hero />
    <Marquee />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 3: Verify visually**

Run dev. Expected: hero with cream→lavender bg, mint+lavender blur shape behind, headline "I build cool & useful things." with mint and lavender highlight pills, squiggle, subhead, two CTAs. Marquee scrolls below.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat(homepage): add Hero with highlights, squiggle, blur shape, CTAs"
```

---

### Task 16: BuildCard component

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/BuildCard.astro`

- [ ] **Step 1: Create the component**

```astro
---
import StatusPill from './StatusPill.astro';
import Button from './Button.astro';
import type { z } from 'zod';
import type { BuildSchema } from '../content/schema';

interface Props { build: z.infer<typeof BuildSchema>; }
const { build } = Astro.props;
---
<article class="bg-cream-warm border border-card-border rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
  <div
    class="relative h-[180px] overflow-hidden"
    style={`background:${build.gradientHeader}`}
  >
    <img
      src={build.screenshot}
      alt={`Screenshot of ${build.title}`}
      class="absolute inset-0 w-full h-full object-cover object-top opacity-95"
      loading="lazy"
    />
    <div class="absolute top-3 right-3">
      <StatusPill variant={build.status} />
    </div>
  </div>
  <div class="p-5">
    <div class="font-mono text-[9px] font-medium uppercase tracking-[1.5px] text-ink/60">
      {build.dates}
    </div>
    <h3 class="font-display font-bold text-[20px] mt-1 tracking-tight-display">
      {build.title}
    </h3>
    <p class="text-[14px] mt-1.5 leading-[1.55] text-ink/80">
      {build.description}
    </p>
    <div class="flex gap-2 mt-4">
      <Button href={build.liveUrl} variant="primary" size="sm" external={true}>
        {build.liveLabel}
      </Button>
      <Button href={`/builds/${build.slug}`} variant="secondary" size="sm">
        Case study →
      </Button>
    </div>
  </div>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BuildCard.astro
git commit -m "feat(components): add BuildCard"
```

---

### Task 17: Builds section

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/BuildsSection.astro`

- [ ] **Step 1: Create the section**

```astro
---
import SectionHeader from './SectionHeader.astro';
import BuildCard from './BuildCard.astro';
import Highlight from './Highlight.astro';
import { builds } from '../content/builds';
---
<section id="builds" class="bg-cream border-b border-card-border/40">
  <div class="max-w-6xl mx-auto px-8 py-16">
    <div class="flex justify-between items-end mb-8 flex-wrap gap-4">
      <SectionHeader number="01" label="builds" squiggleColor="lavender" squiggleWidth={170}>
        Things I've <Highlight color="mint">shipped</Highlight> lately.
      </SectionHeader>
      <div class="font-mono text-[10px] text-ink/50">3 selected · 2024 → 2026</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      {builds.map(build => (
        <BuildCard build={build} />
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to homepage**

In `src/pages/index.astro`, after `<Marquee />`:
```astro
import BuildsSection from '../components/BuildsSection.astro';
// ...in markup
<BuildsSection />
```

- [ ] **Step 3: Verify**

Run dev. Expected: 3 build cards in a row on desktop, stacked on mobile. Each card shows real screenshot (404 placeholders for now — we'll add screenshots in Phase 7).

- [ ] **Step 4: Commit**

```bash
git add src/components/BuildsSection.astro src/pages/index.astro
git commit -m "feat(homepage): add Builds section with 3 cards"
```

---

### Task 18: Career section

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/CareerSection.astro`

- [ ] **Step 1: Create the section**

```astro
---
import SectionHeader from './SectionHeader.astro';
import Highlight from './Highlight.astro';
import Button from './Button.astro';
import BlurShape from './BlurShape.astro';
---
<section id="career" class="relative border-b border-card-border/40" style="background:var(--gradient-career)">
  <BlurShape size={200} opacity={0.15} position="top:40px;right:-60px"
    colors={['var(--color-lavender)', 'var(--color-mint)']} />
  <div class="relative z-10 max-w-6xl mx-auto px-8 py-16">
    <SectionHeader number="02" label="career" squiggleColor="mint" squiggleWidth={180} labelColor="lavender-deep">
      How I <Highlight color="mint">got here</Highlight>.
    </SectionHeader>

    <div class="mt-6 max-w-3xl text-[17px] leading-[1.65] text-ink/95">
      <p>
        In middle school, my friend taught me to edit Neopets pages with HTML at a sleepover. That was it — I was hooked on shaping the web by hand. I studied advertising at CU Boulder (with a tech-and-media minor), spent my early career in a customer-support seat at a startup called Kapost, attended Women Who Code meetups with friends, and finally bet on a thirteen-week bootcamp called Fullstack Academy when bootcamps still felt like a risk…
      </p>
    </div>

    <div class="flex gap-3 mt-7 flex-wrap">
      <Button href="/career" variant="primary" size="sm">Read the full story →</Button>
      <Button href="https://linkedin.com/in/tleriasbird" variant="secondary" size="sm" external={true}>LinkedIn ↗</Button>
      <Button href="https://medium.com/@tleriasbird" variant="secondary" size="sm" external={true}>Medium ↗</Button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to homepage**

`src/pages/index.astro`:
```astro
import CareerSection from '../components/CareerSection.astro';
// after BuildsSection
<CareerSection />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CareerSection.astro src/pages/index.astro
git commit -m "feat(homepage): add Career section preview"
```

---

### Task 19: ImpactStrip component + OffKeyboard section

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/ImpactStrip.astro`
- Create: `/Users/tarabird/Workspace/portfolio/src/components/OffKeyboardSection.astro`

- [ ] **Step 1: Create `ImpactStrip.astro`**

```astro
---
import type { z } from 'zod';
import type { OffKeyboardSchema } from '../content/schema';

interface Props { item: z.infer<typeof OffKeyboardSchema>; }
const { item } = Astro.props;
---
<article class="bg-cream-warm border border-card-border rounded-2xl p-6">
  <h3 class="font-display font-bold text-[22px] tracking-tight-display">
    {item.link ? (
      <a href={item.link} target="_blank" rel="noopener noreferrer" class="hover:text-mint transition-colors">{item.title}</a>
    ) : item.title}
  </h3>
  <div class="font-mono text-[10px] font-medium uppercase tracking-[1.5px] text-ink/55 mt-1">
    {item.meta}
  </div>
  <p class="text-[14px] mt-3 leading-[1.55] text-ink/80">
    {item.description}
  </p>
  <div class="flex gap-5 mt-5">
    {item.stats.map(s => (
      <div>
        <div class="font-display font-extrabold text-[28px] text-forest tracking-tight-display">{s.value}</div>
        <div class="font-mono text-[10px] uppercase tracking-[1px] text-ink/55 mt-0.5">{s.label}</div>
      </div>
    ))}
  </div>
</article>
```

- [ ] **Step 2: Create `OffKeyboardSection.astro`**

```astro
---
import SectionHeader from './SectionHeader.astro';
import Highlight from './Highlight.astro';
import ImpactStrip from './ImpactStrip.astro';
import { offKeyboard } from '../content/off-keyboard';
---
<section id="off-keyboard" class="bg-cream border-b border-card-border/40">
  <div class="max-w-6xl mx-auto px-8 py-16">
    <SectionHeader number="03" label="off-keyboard" squiggleColor="mint">
      <Highlight color="mint">Useful</Highlight> shit, not software.
    </SectionHeader>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
      {offKeyboard.map(item => <ImpactStrip item={item} />)}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add to homepage**

```astro
import OffKeyboardSection from '../components/OffKeyboardSection.astro';
// ...
<OffKeyboardSection />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ImpactStrip.astro src/components/OffKeyboardSection.astro src/pages/index.astro
git commit -m "feat(homepage): add Off-keyboard impact strips"
```

---

### Task 20: OffTheClock section (personal beat)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/OffTheClockSection.astro`

- [ ] **Step 1: Create the section**

```astro
---
import SectionHeader from './SectionHeader.astro';
import Highlight from './Highlight.astro';
import { offTheClock } from '../content/off-the-clock';
---
<section id="off-the-clock" class="border-b border-card-border/40" style="background:var(--gradient-personal)">
  <div class="max-w-6xl mx-auto px-8 py-16">
    <SectionHeader number="04" label="off the clock" squiggleColor="lavender">
      <Highlight color="lavender">Outside</Highlight> the IDE.
    </SectionHeader>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl">
      {offTheClock.map(item => (
        <div class="bg-cream-warm border border-card-border rounded-2xl p-5">
          <h3 class="font-display font-bold text-[17px]">{item.title}</h3>
          <p class="text-[14px] mt-1 text-ink/80 leading-[1.5]">{item.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to homepage**

```astro
import OffTheClockSection from '../components/OffTheClockSection.astro';
// ...
<OffTheClockSection />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/OffTheClockSection.astro src/pages/index.astro
git commit -m "feat(homepage): add Off-the-clock personal beat"
```

---

### Task 21: Contact section + form

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/ContactSection.astro`

- [ ] **Step 1: Create the section**

```astro
---
import SectionHeader from './SectionHeader.astro';
import Highlight from './Highlight.astro';
import Button from './Button.astro';
import BlurShape from './BlurShape.astro';
---
<section id="say-hi" class="relative bg-ink text-cream overflow-hidden">
  <BlurShape size={240} opacity={0.25} position="top:40px;right:-60px" />
  <div class="relative z-10 max-w-6xl mx-auto px-8 py-16">
    <div class="font-mono text-[10px] font-semibold uppercase tracking-[2px] text-mint">
      05 — say hi
    </div>
    <h2 class="font-display font-extrabold text-[46px] md:text-[48px] leading-none tracking-tight-display mt-2">
      Drop a <Highlight color="mint">line</Highlight>.
    </h2>
    <p class="text-[14px] mt-3 max-w-md text-cream/75">
      Yes I take contract work. No I don't take spec interviews. Most things in between, ask.
    </p>

    <form
      method="POST"
      action="/api/contact"
      class="mt-6 max-w-xl"
      id="contact-form"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="name"
          required
          maxlength="100"
          placeholder="your name"
          class="bg-ink-soft border border-mint text-cream rounded-full px-4 py-3 text-[14px] placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-mint"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="your email"
          class="bg-ink-soft border border-mint text-cream rounded-full px-4 py-3 text-[14px] placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-mint"
        />
      </div>
      <textarea
        name="message"
        required
        maxlength="2000"
        placeholder="what's up?"
        class="w-full bg-ink-soft border border-mint text-cream rounded-2xl px-4 py-3 text-[14px] mt-3 min-h-[80px] placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-mint resize-none"
      ></textarea>
      <!-- honeypot for spam bots -->
      <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" />

      <div class="mt-5">
        <Button variant="mint">Send →</Button>
      </div>
      <div id="form-status" class="mt-3 font-mono text-[11px] text-mint min-h-[1em]" aria-live="polite"></div>
    </form>

    <div class="flex gap-5 mt-8 font-mono text-[11px] uppercase tracking-[1px] text-cream/70">
      <a href="https://linkedin.com/in/tleriasbird" target="_blank" rel="noopener noreferrer" class="hover:text-mint">LinkedIn</a>
      <a href="https://medium.com/@tleriasbird" target="_blank" rel="noopener noreferrer" class="hover:text-mint">Medium</a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" class="hover:text-mint">Instagram</a>
    </div>
  </div>
</section>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const status = document.getElementById('form-status')!;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'sending…';
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      if (res.ok) {
        status.textContent = 'sent — talk soon ✓';
        form.reset();
      } else {
        const text = await res.text();
        status.textContent = `couldn't send: ${text}`;
      }
    } catch (err) {
      status.textContent = `couldn't send: ${(err as Error).message}`;
    }
  });
</script>
```

- [ ] **Step 2: Add to homepage**

```astro
import ContactSection from '../components/ContactSection.astro';
// ...after OffTheClockSection
<ContactSection />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactSection.astro src/pages/index.astro
git commit -m "feat(homepage): add Contact section with form"
```

---

## Phase 5 — Case studies + career page

### Task 22: CaseStudy layout

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/layouts/CaseStudy.astro`

- [ ] **Step 1: Create the layout**

```astro
---
import Base from './Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import StatusPill from '../components/StatusPill.astro';
import Button from '../components/Button.astro';
import Squiggle from '../components/Squiggle.astro';

interface Props {
  title: string;
  eyebrow: string;          // e.g., "2024 → ongoing · ENGINEER"
  description: string;
  liveUrl: string;
  liveLabel: string;
  status: 'live' | 'kids';
  gradientHeader: string;
  heroImage?: string;
  stats?: { label: string; value: string }[];
}
const { title, eyebrow, description, liveUrl, liveLabel, status, gradientHeader, heroImage, stats = [] } = Astro.props;
---
<Base title={`${title} — Tara Bird`} description={description}>
  <Nav />
  <main>
    <section class="relative overflow-hidden" style={`background:${gradientHeader};min-height:45vh`}>
      {heroImage && (
        <img src={heroImage} alt={`Screenshot of ${title}`} loading="eager"
          class="absolute inset-0 w-full h-full object-cover opacity-25" />
      )}
      <div class="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <a href="/#builds" class="font-mono text-[11px] uppercase tracking-[1.5px] text-cream/70 hover:text-mint">
          ← back to builds
        </a>
        <div class="mt-8">
          <div class="font-mono text-[10px] font-medium uppercase tracking-[2px] text-mint">
            {eyebrow}
          </div>
          <h1 class="font-display font-extrabold text-[64px] md:text-[78px] leading-[0.96] tracking-tightest-display mt-3 text-cream max-w-3xl">
            {title}
          </h1>
          <div class="mt-2"><Squiggle color="mint" width={240} /></div>
          <p class="text-[18px] mt-5 max-w-xl text-cream/90 leading-[1.55]">
            {description}
          </p>
          <div class="flex gap-3 mt-6 items-center">
            <Button href={liveUrl} variant="mint" external={true}>{liveLabel}</Button>
            <StatusPill variant={status} />
          </div>
        </div>
      </div>
    </section>

    {stats.length > 0 && (
      <section class="bg-cream border-b border-card-border/40">
        <div class="max-w-6xl mx-auto px-8 py-8 flex gap-10 flex-wrap">
          {stats.map(s => (
            <div>
              <div class="font-mono text-[10px] uppercase tracking-[2px] text-ink/55">{s.label}</div>
              <div class="font-display font-bold text-[22px] mt-1 tracking-tight-display">{s.value}</div>
            </div>
          ))}
        </div>
      </section>
    )}

    <article class="max-w-3xl mx-auto px-8 py-16 prose prose-lg
      prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight-display
      prose-h2:text-[36px] prose-h2:mt-12
      prose-h3:text-[22px]
      prose-p:text-[17px] prose-p:leading-[1.65]
      prose-a:text-mint prose-a:no-underline hover:prose-a:underline
      prose-strong:font-bold">
      <slot />
    </article>

    <section class="bg-cream border-t border-card-border/40">
      <div class="max-w-3xl mx-auto px-8 py-10 flex gap-3 flex-wrap">
        <Button href={liveUrl} variant="primary" external={true}>{liveLabel}</Button>
        <Button href="/#builds" variant="secondary">Back to builds →</Button>
        <Button href="/#say-hi" variant="secondary">Say hi →</Button>
      </div>
    </section>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Install Tailwind typography**

```bash
npm install -D @tailwindcss/typography
```

Update `tailwind.config.mjs` to add the plugin:
```js
import typography from '@tailwindcss/typography';

export default {
  // ... existing config
  plugins: [typography],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/CaseStudy.astro tailwind.config.mjs package.json package-lock.json
git commit -m "feat(layout): add CaseStudy layout with hero, stats, prose body"
```

---

### Task 23: Severance case study page

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/pages/builds/severance.mdx`

- [ ] **Step 1: Create the page**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: Layoff Calculator
eyebrow: "2024 → ONGOING · INDIE PRODUCT"
description: "A free, source-cited tool that grades severance offers and estimates runway in sixty seconds."
liveUrl: "https://layoffcalculator.com"
liveLabel: "Visit ↗"
status: "live"
gradientHeader: "linear-gradient(135deg, #0d2820 0%, #1a4a3a 100%)"
heroImage: "/screenshots/severance-hero.png"
stats:
  - label: "LIVE AT"
    value: "layoffcalculator.com"
  - label: "STACK"
    value: "Next.js · TypeScript · Supabase"
  - label: "ROLE"
    value: "Sole engineer, designer, content"
  - label: "SHIPPED"
    value: "2024 · still shipping"
---

## What it does

The Layoff Calculator grades a severance offer the way an experienced negotiator would — fast, source-cited, and free.

You paste in the numbers (base, bonus, equity, target separation date), it estimates your runway, models your equity (RSU/ISO/NSO), checks WARN Act eligibility for your state, and produces a one-page verdict you can take to your employer or an attorney.

No account. No paywall. No data sold. Funded entirely by optional affiliate links and attorney referrals you can choose to use — never required.

## Why I built it

A friend got laid off in the 2023 round of layoffs and texted me a screenshot of their offer with one question: "is this fair?" I couldn't answer it confidently in under an hour. That bothered me.

The existing tools were either calculator-shaped lead-gen for law firms, or paywalled, or used decade-old WARN Act data. There was no public, source-cited, free tool that just answered the question.

So I built one.

## How it works

The hard part of this product isn't the math — the hard part is **earning the user's trust in the numbers**.

Every claim on the site (a state law, a WARN Act threshold, a tax rate, a typical severance multiple) is anchored to a public source. The build pipeline enforces this: if a claim doesn't have a citation, the build fails. If a citation can't be reached at build time, the build fails. If a citation's content has materially changed since I last verified it, the build flags it for review.

Behind that, a **content refresh pipeline** keeps state-by-state data, WARN Act guidance, and the equity modeling current. (I'll skip the implementation details here — the whole point is that you should trust the numbers because of the visible citation, not because of how the pipeline works.)

The math itself runs entirely in the browser. The Supabase backend handles only optional things: saved scenarios for returning users, and aggregate (anonymized) usage data so I can see which fields are most-used and what's broken.

## What I'm proud of

- **The trust gates.** Every visible number traces to a public source you can click. The build literally refuses to ship if that breaks.
- **The verdict format.** Most calculators dump a table at you. This one renders a single-page verdict — the negotiation move, the runway estimate, the state-specific caveat — in a way you can show your employer.
- **Equity modeling that doesn't lie.** RSUs, ISOs, NSOs, and acceleration clauses all behave differently at separation. The calculator handles each correctly and shows its work.
- **Zero account required.** You can use the entire product without giving me a single piece of personal information.

## What I'd do differently

Started building the content pipeline before I had three months of public-source-citation patterns to base it on. Spent a quarter rebuilding once I knew what the rules should actually be. If I did it again, I'd hand-curate the first 50 claims, see the pattern, *then* automate.
```

- [ ] **Step 2: Verify**

Run dev. Visit `http://localhost:4321/builds/severance`. Expected: page renders with dark hero, "Layoff Calculator" title, stats strip, prose body.

- [ ] **Step 3: Commit**

```bash
git add src/pages/builds/severance.mdx
git commit -m "feat(case-study): Severance case study (vague pipeline framing)"
```

---

### Task 24: Rollcall case study page

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/pages/builds/rollcall.mdx`

- [ ] **Step 1: Create the page**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: Rollcall
eyebrow: "2025 → ONGOING · INDIE PRODUCT"
description: "A training log and community for jiu-jitsu practitioners. Tracks belts, drills, and the people you roll with."
liveUrl: "https://www.meetwithrollcall.com/u/tara"
liveLabel: "Visit ↗"
status: "live"
gradientHeader: "linear-gradient(135deg, #fef9f0 0%, #f3eef8 100%)"
heroImage: "/screenshots/rollcall-profile.png"
stats:
  - label: "LIVE AT"
    value: "meetwithrollcall.com"
  - label: "STACK"
    value: "Next.js · Supabase · Playwright"
  - label: "ROLE"
    value: "Sole engineer + designer"
  - label: "SHIPPED"
    value: "2025"
---

## What it does

Rollcall is the training log I always wanted for jiu-jitsu — and a soft community layer on top.

You log every roll (your training partner, what you worked, how it went), track your belt progression, and over time build a real record of who you train with and what you're working on. It's social without being a social network: you can follow practitioners, see who's at your gym tonight, and connect with people you've actually rolled with.

## Why I built it

A year into my jiu-jitsu obsession, I had a year of training and almost zero record of it. I knew who I'd rolled with the last week, maybe. I had no sense of what I'd been working, what was getting better, or what was still a hole.

The existing options were either generic habit trackers (no concept of "rolling partner" or "submission attempt"), or pen-and-paper logs (don't work for the social side). I wanted something purpose-built for the sport.

So I built it. And then realized other practitioners had the same problem.

## How it works

Pretty standard modern web app:

- **Next.js** for the frontend and API routes
- **Supabase** for postgres, auth, and storage (profile photos, gym banners)
- **React Hook Form + Zod** for form validation
- **React Google Maps** for the gym-location features
- **Playwright** for end-to-end tests covering the critical user flows (sign up, log a roll, follow a practitioner)
- **Vitest** for unit tests on the business logic (belt progression, weekly summaries)
- **Sentry** for error tracking in production
- **pnpm workspaces** monorepo so a future mobile app can share the same data layer

The data model is the interesting part. A "roll" is a first-class entity that connects a date, two practitioners, a set of techniques drilled, and a vibe score. Everything else (your belt history, weekly summaries, partner suggestions, gym presence) is a view on top of that single entity.

## What I'm proud of

- **The belt visualization.** It's a single horizontal SVG that reads "WHITE" or "BLUE" with stripe indicators. It looks like the real thing. Practitioners get it instantly.
- **The roll as a first-class entity.** Made everything else easier. Weekly summaries write themselves. Partner suggestions become a single query.
- **End-to-end coverage of the critical flows.** Playwright covers sign up → log a roll → follow a practitioner. I've shipped during open mat with confidence.
- **Privacy defaults.** Profiles are private by default. You opt in to being discoverable. Took a lot of thought to get this right for a sport where people often have a public-private gradient.

## What I'd do differently

Built the social features too early. The training log alone is the product for most practitioners. The community layer is what keeps people, but only after they've built a habit of logging. I'd ship just the log first, then layer in social.
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/builds/rollcall.mdx
git commit -m "feat(case-study): Rollcall"
```

---

### Task 25: Knock It Off case study page

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/pages/builds/knock-it-off.mdx`

- [ ] **Step 1: Create the page**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: Knock It Off
eyebrow: "2025 · GAME · FOR THE KIDS"
description: "A tap-and-knock game where a cat shoves food off the counter to a hungry dog. Built in Godot, mostly for my kids."
liveUrl: "https://knock-it-off.vercel.app"
liveLabel: "Play ↗"
status: "kids"
gradientHeader: "linear-gradient(180deg, #8a6f5a 0%, #5b3a2a 100%)"
heroImage: "/screenshots/knock-it-off-cat-select.png"
stats:
  - label: "PLAY AT"
    value: "knock-it-off.vercel.app"
  - label: "BUILT WITH"
    value: "Godot 4.6 · GDScript"
  - label: "ROUND LENGTH"
    value: "45 seconds"
  - label: "PLAYTESTED BY"
    value: "Three short humans"
---

## What it does

You pick a cat (Waffles or Prince), the cat sits on a kitchen counter, food appears, and you tap to knock it off. A hungry dog catches it below. 45-second rounds, scoring, replay.

## Why I built it

My kids think it is the funniest thing in the world when a cat puts a paw on the counter and slowly nudges something off. I wanted to make them a game where they get to *be* the cat.

Also: I've wanted to learn Godot for a while, and a short tap-game for kids is roughly the perfect first project.

## How it works

- **Godot 4.6** with GDScript
- **Pixel art** sprites for the cat, dog, counter, and food
- **Web export** so they can play it on the iPad without an app store install
- **Responsive layout** that works on web *and* iPad landscape (tablet was the actual target platform)
- **Clean scene/script architecture** — main menu, game scene, score scene as separate nodes; signals between them for round events; no shared mutable state

## What I'm proud of

- **It actually shipped.** Most "I should learn Godot" projects sit in a folder.
- **My kids play it on their own.** Best possible review.
- **Cat physics that feel right.** The "knock" arc is hand-tuned for the satisfying paw-tap motion.
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/builds/knock-it-off.mdx
git commit -m "feat(case-study): Knock It Off"
```

---

### Task 26: Full career page

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/pages/career.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Highlight from '../components/Highlight.astro';
import Squiggle from '../components/Squiggle.astro';
import Button from '../components/Button.astro';
---
<Base title="Career — Tara Bird" description="How I got here: Neopets → CU Boulder → Kapost → Fullstack Academy → Priceline → TadaWeb → HelloFresh → Guild → Gusto.">
  <Nav />
  <main class="bg-cream">
    <div class="max-w-3xl mx-auto px-8 py-16">
      <a href="/" class="font-mono text-[11px] uppercase tracking-[1.5px] text-ink/60 hover:text-mint">← back</a>

      <div class="mt-8">
        <div class="font-mono text-[10px] font-semibold uppercase tracking-[2px] text-lavender">career — the long version</div>
        <h1 class="font-display font-extrabold text-[64px] leading-[0.96] tracking-tightest-display mt-3">
          How I <Highlight color="mint">got here</Highlight>.
        </h1>
        <div class="mt-2"><Squiggle color="mint" width={280} /></div>
      </div>

      <div class="mt-10 space-y-10 text-[17px] leading-[1.7] text-ink/95">

        <section>
          <h2 class="font-display font-extrabold text-[28px] tracking-tight-display mb-3">Where it started.</h2>
          <p>In middle school, my friend taught me to edit Neopets pages with HTML at a sleepover. That was it. I spent the next decade quietly learning HTML, CSS, and JavaScript by changing how my homepage looked, then how other people's homepages looked, then everything I could get my hands on.</p>
          <p class="mt-3">I went to the University of Colorado at Boulder to study advertising — with a minor in Technology, Arts & Media. (I also learned to love snowboarding, hiking, and camping, and never quite shook any of them.)</p>
          <p class="mt-3">My first job out of college was a customer-support seat at a startup called Kapost in Boulder. I was sitting next to the engineering team and watching how they worked, and the old itch came back hard. I started going to Women Who Code meetups with friends — shoutout to my still-best-friend Kinsey Durham Grace, now at GitHub — and we taught ourselves Ruby on Rails. After a couple of years of that, I bet on a brand-new thirteen-week coding school called Fullstack Academy, when bootcamps still felt like a real risk. Thirteen weeks of MEAN stack later, I was ready.</p>
        </section>

        <section>
          <h2 class="font-display font-extrabold text-[28px] tracking-tight-display mb-3">Off to the races.</h2>
          <p>My first move after Fullstack was driven by fear of unemployment. I declined the final rounds at Refinery29 and took the first offer I got. That startup folded within months. A bootcamp classmate then helped me into Priceline.com — and that's the moment I knew this was my career, not a phase.</p>
          <p class="mt-3">At Priceline, I rebuilt the legacy checkout flow in Angular for both desktop and mobile web. Then I moved abroad to <strong>TadaWeb in Luxembourg City</strong> for a chapter that was honestly more about living in Europe and traveling than any one shipped project.</p>
          <p class="mt-3">Back in the U.S., I joined <strong>HelloFresh</strong> as a Staff Engineer with the intent of growing into management. I joined their six-month squad-lead-in-training program and fell in love with mentoring engineers — that's where I figured out that growing people into their full potential was the work I most wanted to do.</p>
          <p class="mt-3">Then <strong>Guild Education</strong>, where I worked on cleaning and validating large datasets from academic partners to power revenue and revshare.</p>
        </section>

        <section>
          <h2 class="font-display font-extrabold text-[28px] tracking-tight-display mb-3">Today, at Gusto.</h2>
          <p>I'm an Engineering Manager at Gusto, leading the Pro Integrations team — the connections between Gusto's payroll and accounting platform and the external tools accountants rely on (QuickBooks Online, Xero, FreshBooks, Sage Intacct, and a new partner integration delivered to closed beta in 2026). I lead a team of five engineers spanning Senior through Senior Staff.</p>
          <p class="mt-3">In a single recent quarter, my team delivered a new partner integration end-to-end, cut sync error rates from <strong>15% to 7%</strong>, reduced average time-to-resolve from twenty days to nine, removed approximately <strong>15,000 lines of legacy code</strong> and millions of obsolete rows as part of a multi-quarter monolith extraction, and migrated <strong>85 GraphQL objects</strong> to a new authorization layer. We drove a <strong>92% reduction</strong> in weekly production errors in the closing weeks of the quarter and posted a <strong>+57% PR throughput gain</strong> during an AI-tooling sprint.</p>
          <p class="mt-3">Alongside leading the team, I invest in engineering management <em>infrastructure</em> — lightweight automations, dashboards, and structured review formats that scale a single manager's effectiveness. A monthly operational review automation, an on-call rotation dashboard, a project-sync coordination layer, a structured calibration report format. None of these replaces management judgment. They free up more attention for it.</p>
        </section>

      </div>

      <div class="mt-12 flex gap-3 flex-wrap">
        <Button href="https://linkedin.com/in/tleriasbird" variant="primary" external={true}>LinkedIn ↗</Button>
        <Button href="https://medium.com/@tleriasbird" variant="secondary" external={true}>Medium ↗</Button>
        <Button href="/#say-hi" variant="secondary">Say hi →</Button>
      </div>
    </div>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/career.astro
git commit -m "feat(career): full narrative career page"
```

---

## Phase 6 — Easter eggs, polish, 404

### Task 27: 404 page

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/pages/404.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Button from '../components/Button.astro';
import Highlight from '../components/Highlight.astro';
import Squiggle from '../components/Squiggle.astro';
---
<Base title="Not found — Tara Bird" description="This page got knocked off the counter.">
  <Nav />
  <main class="bg-cream min-h-[60vh] flex items-center">
    <div class="max-w-3xl mx-auto px-8 py-16">
      <div class="font-mono text-[10px] font-semibold uppercase tracking-[2px] text-lavender">404 — gone</div>
      <h1 class="font-display font-extrabold text-[64px] leading-[0.96] tracking-tightest-display mt-3">
        This page got <Highlight color="mint">knocked off</Highlight> the counter.
      </h1>
      <div class="mt-2"><Squiggle color="lavender" width={280} /></div>
      <p class="text-[17px] mt-6 max-w-xl text-ink/85">Try a different one ↓</p>
      <div class="flex gap-3 mt-6 flex-wrap">
        <Button href="/" variant="primary">Home →</Button>
        <Button href="/#builds" variant="secondary">Builds</Button>
        <Button href="/#say-hi" variant="secondary">Say hi</Button>
      </div>
    </div>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat(404): themed not-found page"
```

---

### Task 28: Konami code easter egg (TDD on the sequence matcher)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/konami.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/__tests__/konami.test.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/components/KonamiSurprise.astro`

- [ ] **Step 1: Write failing tests**

`src/lib/__tests__/konami.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { createKonamiMatcher } from '../konami';

const FULL = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

describe('konami matcher', () => {
  it('returns true when the full sequence is pressed in order', () => {
    const matcher = createKonamiMatcher();
    let triggered = false;
    for (const key of FULL) {
      triggered = matcher(key);
    }
    expect(triggered).toBe(true);
  });

  it('resets when a wrong key is pressed', () => {
    const matcher = createKonamiMatcher();
    matcher('ArrowUp');
    matcher('ArrowDown'); // wrong — second should be ArrowUp
    // Should now start fresh: pressing the full sequence still works
    let triggered = false;
    for (const key of FULL) {
      triggered = matcher(key);
    }
    expect(triggered).toBe(true);
  });

  it('does not trigger on partial sequence', () => {
    const matcher = createKonamiMatcher();
    for (const key of FULL.slice(0, FULL.length - 1)) {
      expect(matcher(key)).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run, confirm fails**

Run: `npm test`. Expected: failures — `createKonamiMatcher` does not exist.

- [ ] **Step 3: Implement**

`src/lib/konami.ts`:
```ts
const SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export function createKonamiMatcher(): (key: string) => boolean {
  let index = 0;
  return (key: string) => {
    if (key === SEQUENCE[index]) {
      index++;
      if (index === SEQUENCE.length) {
        index = 0;
        return true;
      }
    } else {
      // Restart from this key if it could be the start
      index = key === SEQUENCE[0] ? 1 : 0;
    }
    return false;
  };
}
```

- [ ] **Step 4: Run tests, confirm pass**

Run: `npm test`. Expected: all 3 konami tests pass.

- [ ] **Step 5: Create the visual component**

`src/components/KonamiSurprise.astro`:
```astro
<div id="konami-surprise" aria-hidden="true"
  class="fixed bottom-8 left-[-80px] z-[100] pointer-events-none text-5xl select-none opacity-0">
  🐈‍⬛
</div>
<script>
  import { createKonamiMatcher } from '../lib/konami';
  const surprise = document.getElementById('konami-surprise')!;
  const matcher = createKonamiMatcher();
  document.addEventListener('keydown', (e) => {
    if (matcher(e.key)) {
      surprise.classList.add('walking');
      setTimeout(() => surprise.classList.remove('walking'), 4000);
    }
  });
</script>
<style>
  #konami-surprise.walking {
    animation: walk 4s linear forwards;
  }
  @keyframes walk {
    0%   { transform: translateX(0);                 opacity: 1; }
    20%  { transform: translateX(30vw) rotate(-10deg);}
    40%  { transform: translateX(50vw) rotate(15deg) translateY(-30px); }
    60%  { transform: translateX(70vw) rotate(-5deg); }
    100% { transform: translateX(110vw) rotate(0deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    #konami-surprise.walking { animation: none; opacity: 0; }
  }
</style>
```

- [ ] **Step 6: Add to Base layout**

Modify `src/layouts/Base.astro` body:
```astro
<body class="font-body bg-cream text-ink">
  <slot />
  <KonamiSurprise />
</body>
```

And import at the top of the frontmatter:
```astro
import KonamiSurprise from '../components/KonamiSurprise.astro';
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/konami.ts src/lib/__tests__/konami.test.ts src/components/KonamiSurprise.astro src/layouts/Base.astro
git commit -m "feat(easter-egg): konami code triggers a wandering cat"
```

---

### Task 29: Scroll-in animations (intersection observer)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/components/ScrollFadeIn.astro`

- [ ] **Step 1: Create the component**

`src/components/ScrollFadeIn.astro`:
```astro
<div data-fade-in class="opacity-0 translate-y-6 transition-all duration-500 ease-out">
  <slot />
</div>
<script>
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const els = document.querySelectorAll('[data-fade-in]');
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.remove('opacity-0', 'translate-y-6');
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('[data-fade-in]').forEach(el => {
      (el as HTMLElement).classList.remove('opacity-0', 'translate-y-6');
    });
  }
</script>
```

- [ ] **Step 2: Wrap section content where desired**

Optional polish — wrap each section's main content block in `<ScrollFadeIn>` in `BuildsSection.astro`, `CareerSection.astro`, `OffKeyboardSection.astro`, `OffTheClockSection.astro`. Example for BuildsSection:
```astro
import ScrollFadeIn from './ScrollFadeIn.astro';
// wrap the grid:
<ScrollFadeIn>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {builds.map(...)}
  </div>
</ScrollFadeIn>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollFadeIn.astro src/components/BuildsSection.astro src/components/CareerSection.astro src/components/OffKeyboardSection.astro src/components/OffTheClockSection.astro
git commit -m "feat(motion): add ScrollFadeIn intersection observer wrapper"
```

---

### Task 30: Wordmark hover delight (tiny pulse)

**Files:**
- Modify: `/Users/tarabird/Workspace/portfolio/src/components/Nav.astro`

- [ ] **Step 1: Modify the wordmark span**

In `Nav.astro`, replace the wordmark dot span with:
```astro
<span class="w-2.5 h-2.5 rounded-full bg-mint nav-dot transition-colors"></span>
```

And add at the bottom of the file:
```astro
<style>
  a.group:hover .nav-dot {
    animation: nav-pulse 1.5s ease-in-out;
  }
  @keyframes nav-pulse {
    0%, 100% { background-color: var(--color-mint); }
    50%      { background-color: var(--color-lavender); }
  }
  @media (prefers-reduced-motion: reduce) {
    a.group:hover .nav-dot { animation: none; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(nav): wordmark hover pulse delight"
```

---

## Phase 7 — Product screenshots

### Task 31: Capture and save product screenshots

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/public/screenshots/severance-hero.png`
- Create: `/Users/tarabird/Workspace/portfolio/public/screenshots/rollcall-profile.png`
- Create: `/Users/tarabird/Workspace/portfolio/public/screenshots/knock-it-off-cat-select.png`

- [ ] **Step 1: Install Playwright (for repeatable screenshots)**

Run:
```bash
npm install -D playwright
npx playwright install chromium
```

- [ ] **Step 2: Create a screenshot script**

Create `scripts/screenshot-products.mjs`:
```js
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const targets = [
  {
    url: 'https://layoffcalculator.com',
    out: 'public/screenshots/severance-hero.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 1500,
  },
  {
    url: 'https://www.meetwithrollcall.com/u/tara',
    out: 'public/screenshots/rollcall-profile.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 3000,
    scrollTo: 800,
  },
  {
    url: 'https://knock-it-off.vercel.app',
    out: 'public/screenshots/knock-it-off-cat-select.png',
    viewport: { width: 1440, height: 900 },
    waitMs: 3000,
  },
];

await mkdir('public/screenshots', { recursive: true });
const browser = await chromium.launch();

for (const t of targets) {
  const ctx = await browser.newContext({ viewport: t.viewport });
  const page = await ctx.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle' });
  if (t.scrollTo) {
    await page.evaluate((y) => {
      const scrollable = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollable) scrollable.scrollTop = y;
      else window.scrollTo(0, y);
    }, t.scrollTo);
  }
  await page.waitForTimeout(t.waitMs);
  await page.screenshot({ path: t.out, fullPage: false });
  console.log(`✓ ${t.out}`);
  await ctx.close();
}
await browser.close();
console.log('done.');
```

- [ ] **Step 3: Add npm script**

In `package.json`, add to scripts:
```json
"screenshots": "node scripts/screenshot-products.mjs"
```

- [ ] **Step 4: Run it**

Run: `npm run screenshots`
Expected: three PNG files written to `public/screenshots/`.

- [ ] **Step 5: Verify on the homepage and case study pages**

Run: `npm run dev`. Visit homepage, then each `/builds/...` page. Expected: real screenshots show in the card headers and case study hero areas. They should fit cleanly with the gradient overlay.

- [ ] **Step 6: Commit screenshots + script**

```bash
git add scripts/ public/screenshots/ package.json package-lock.json
git commit -m "feat(assets): capture product screenshots via Playwright script"
```

---

### Task 32: Open Graph image

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/public/og-image.png` (1200x630)
- Create: `/Users/tarabird/Workspace/portfolio/public/favicon.svg`

- [ ] **Step 1: Generate a simple OG image**

Add this to `scripts/screenshot-products.mjs` or create `scripts/og-image.mjs`:
```js
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const html = `<!doctype html>
<html><head><style>
  @import url('https://fonts.bunny.net/css?family=inter:800');
  body { margin: 0; padding: 0; background: linear-gradient(165deg, #fdf6f0 0%, #fdf6f0 40%, #f3eef8 100%); width: 1200px; height: 630px; font-family: Inter, sans-serif; display: flex; flex-direction: column; justify-content: center; padding: 80px; box-sizing: border-box; }
  .label { font-size: 18px; letter-spacing: 4px; text-transform: uppercase; color: #5b4380; font-family: monospace; font-weight: 600; }
  h1 { font-size: 110px; font-weight: 800; letter-spacing: -4px; line-height: 0.95; margin: 20px 0 0 0; color: #0d2820; }
  .hi { background: #5fc9a0; padding: 0 18px; border-radius: 12px; }
  .lav { background: #8b7ab8; padding: 0 18px; border-radius: 12px; color: #fef9f0; }
  p { font-size: 26px; margin-top: 40px; color: #1a1a1a; max-width: 800px; line-height: 1.4; }
</style></head><body>
  <div class="label">hi, i'm tara</div>
  <h1>I build<br><span class="hi">cool</span> &amp; <span class="lav">useful</span> things.</h1>
  <p>tarabird.com</p>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('✓ og-image.png');
```

Add to `package.json` scripts: `"og": "node scripts/og-image.mjs"`

Run: `npm run og`
Expected: `public/og-image.png` (1200x630) shows the hero in the brand style.

- [ ] **Step 2: Create a minimal favicon.svg**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#5fc9a0"/><text x="16" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="18" fill="#0d2820">t</text></svg>
```

- [ ] **Step 3: Commit**

```bash
git add public/og-image.png public/favicon.svg scripts/og-image.mjs package.json
git commit -m "feat(assets): OG image + favicon"
```

---

## Phase 8 — Contact form backend

### Task 33: Vercel serverless endpoint for contact form (TDD on the validator)

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/contact.ts`
- Create: `/Users/tarabird/Workspace/portfolio/src/lib/__tests__/contact.test.ts`
- Create: `/Users/tarabird/Workspace/portfolio/api/contact.ts`

- [ ] **Step 1: Write failing tests for the validator**

`src/lib/__tests__/contact.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateContact } from '../contact';

describe('validateContact', () => {
  it('passes valid input', () => {
    const r = validateContact({ name: 'Ada', email: 'ada@example.com', message: 'Hello there', company: '' });
    expect(r.ok).toBe(true);
  });

  it('rejects missing name', () => {
    const r = validateContact({ name: '', email: 'a@b.com', message: 'hi', company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = validateContact({ name: 'A', email: 'not-an-email', message: 'hi', company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects when honeypot is filled (spam)', () => {
    const r = validateContact({ name: 'A', email: 'a@b.com', message: 'hi', company: 'bot' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/spam/i);
  });

  it('rejects oversized message', () => {
    const r = validateContact({ name: 'A', email: 'a@b.com', message: 'x'.repeat(5000), company: '' });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run, confirm fails**

Run: `npm test`. Expected: failures — module not found.

- [ ] **Step 3: Implement the validator**

`src/lib/contact.ts`:
```ts
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(2000),
  company: z.string().max(0, { message: 'spam detected' }),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export type ValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string };

export function validateContact(input: unknown): ValidationResult {
  const result = ContactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const firstErr = result.error.issues[0];
  return { ok: false, error: firstErr.message };
}
```

- [ ] **Step 4: Run tests, confirm pass**

Run: `npm test`. Expected: all 5 contact tests pass.

- [ ] **Step 5: Create the Vercel API route**

`api/contact.ts`:
```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateContact } from '../src/lib/contact';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('method not allowed');
  }

  // Parse formdata or JSON
  let payload: Record<string, string> = {};
  if (typeof req.body === 'object' && req.body) {
    payload = req.body as Record<string, string>;
  } else if (typeof req.body === 'string') {
    const params = new URLSearchParams(req.body);
    for (const [k, v] of params.entries()) payload[k] = v;
  }

  const result = validateContact(payload);
  if (!result.ok) return res.status(400).send(result.error);

  // Send the email via Resend (or any provider). For MVP, log + return ok.
  // Replace this with an actual Resend/Postmark/Plain.com call once you have an API key.
  console.log('CONTACT submission:', result.data);

  // To wire Resend: install `npm install resend` and:
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'hello@tarabird.com',
  //   to: 'tara@tarabird.com',
  //   subject: `Portfolio contact from ${result.data.name}`,
  //   text: `${result.data.message}\n\n— ${result.data.name} <${result.data.email}>`,
  // });

  return res.status(200).send('ok');
}
```

- [ ] **Step 6: Install Vercel node types**

```bash
npm install -D @vercel/node
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact.ts src/lib/__tests__/contact.test.ts api/contact.ts package.json package-lock.json
git commit -m "feat(api): validated /api/contact endpoint with spam honeypot"
```

---

## Phase 9 — Deploy + verify

### Task 34: Connect Vercel + custom domain

**Files:**
- Modify: `/Users/tarabird/Workspace/portfolio/.env.example` (new)

- [ ] **Step 1: Create `.env.example`**

```
# Resend (or other transactional email provider) for contact form
RESEND_API_KEY=
# Where contact form sends to
CONTACT_TO_EMAIL=tara@tarabird.com
```

- [ ] **Step 2: Install Vercel CLI globally (if not already)**

Run: `npm install -g vercel`

- [ ] **Step 3: Link the project to Vercel**

```bash
vercel link
```
Follow prompts to create a new project named `tarabird`. Confirm framework as "Astro."

- [ ] **Step 4: Configure environment variables in Vercel dashboard**

Via the Vercel web UI (Project → Settings → Environment Variables):
- `RESEND_API_KEY` = (your Resend API key, set up at resend.com)
- `CONTACT_TO_EMAIL` = `tara@tarabird.com`

- [ ] **Step 5: Add custom domain**

Via Vercel dashboard (Project → Settings → Domains): add `tarabird.com` and `www.tarabird.com`. Update the DNS records at your domain registrar per Vercel's instructions.

- [ ] **Step 6: First production deploy**

```bash
vercel --prod
```
Expected: build succeeds, deployed to your `*.vercel.app` preview URL and (once DNS propagates) to `tarabird.com`.

- [ ] **Step 7: Test the contact form on prod**

Submit a test message via the live site contact form. Verify:
- Honeypot doesn't trigger (you're a real human)
- 200 OK response
- Email arrives in your inbox (once Resend is wired)

- [ ] **Step 8: Commit env example**

```bash
git add .env.example
git commit -m "docs: add .env.example for Vercel deployment"
```

---

### Task 35: Lighthouse audit + performance budget

**Files:**
- Create: `/Users/tarabird/Workspace/portfolio/scripts/lighthouse.sh`

- [ ] **Step 1: Run Lighthouse against the production site**

```bash
npx lighthouse https://tarabird.com --output html --output-path ./lighthouse-report.html --view
```

- [ ] **Step 2: Check scores against the budget (from spec §7)**

Spec requires:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- Total JS shipped: < 30 KB compressed
- LCP: < 1.5s on 3G

If any score < 95:
- Common causes: oversized hero image, unsized images causing CLS, missing alt text, low-contrast text. Fix the specific finding rather than guessing.

- [ ] **Step 3: Document the baseline**

Write the four Lighthouse scores into a comment block at the top of `README.md`:
```markdown
## Lighthouse baseline (YYYY-MM-DD)

- Performance: 99
- Accessibility: 100
- Best Practices: 100
- SEO: 100
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: record Lighthouse baseline"
```

---

### Task 36: Final smoke test checklist

- [ ] **Step 1: Walk through the live site**

In a browser:
- [ ] Home page loads. Hero, marquee, builds, career, off-keyboard, off-the-clock, contact, footer all render.
- [ ] Marquee scrolls. Hover pauses it.
- [ ] Each build card screenshot loads correctly.
- [ ] Clicking each "Case study →" link goes to the right `/builds/...` page.
- [ ] Each case study page renders: hero, stats, prose body, footer CTAs.
- [ ] "Read the full story →" goes to `/career`.
- [ ] LinkedIn and Medium buttons open in new tabs.
- [ ] Contact form submits successfully, shows "sent — talk soon ✓".
- [ ] Email arrives in your inbox.
- [ ] Honeypot test: open dev tools, manually set the `company` input to a value, try submitting. Expect 400.
- [ ] Visit `/not-a-real-page`. Expect themed 404.
- [ ] Konami code: focus the document, press `↑↑↓↓←→←→ba`. Cat walks across.
- [ ] Hover the wordmark dot in the nav. It pulses.
- [ ] View source. HTML signature comment is there.
- [ ] Inspect element on a section. Confirm Inter is loaded, no serif anywhere.
- [ ] Resize browser to 375px wide. Layout works on mobile.
- [ ] Turn on macOS "Reduce Motion" preference (or use DevTools to emulate `prefers-reduced-motion: reduce`). Marquee stops, scroll-fade-ins resolve to visible, konami doesn't animate.
- [ ] OG image: paste tarabird.com into Slack/Twitter/Discord. Card renders.

If any check fails, file a follow-up task and fix before announcing.

- [ ] **Step 2: Tag the v1 release**

```bash
git tag -a v1.0.0 -m "Initial portfolio launch"
git push origin v1.0.0
```

---

## Self-review (already run by plan author)

**Spec coverage:** Every section of the spec maps to one or more tasks above. All five homepage sections, all three case studies, the full career page, contact form, easter eggs, performance budget, and deploy are covered.

**Placeholders:** None — every step has either code or a concrete command + expected output.

**Type consistency:** `BuildSchema`, `OffKeyboardSchema`, `OffTheClockSchema`, `validateContact`, `createKonamiMatcher`, `interleaveSeparator`, `doubleForLoop` — all defined in earlier tasks and referenced consistently later.

**Open follow-ups (intentionally deferred):**
- Real Resend (or alternative) email-sending wiring lives behind a clear inline comment in `api/contact.ts` so future-Tara can wire it when she's ready.
- Phase 2 polish items (commissioned paper-cut illustrations, additional easter eggs, analytics) are explicitly spec'd as post-MVP in the design doc and not in this plan.

---

*End of implementation plan.*
