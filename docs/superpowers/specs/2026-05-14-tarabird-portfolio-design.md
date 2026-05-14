# tarabird.com — Portfolio Design Spec

**Owner:** Tara Bird
**Date:** 2026-05-14
**Status:** Draft for approval

---

## 1. Purpose & audience

A personality-first personal site that showcases Tara's engineering work and serves as a personal artifact she's proud of. Secondary purposes: discoverable to her network, credible to potential contracting clients, scannable for engineering peers.

**Audience priority (ranked):**
1. **Personal artifact** — first and foremost, a site Tara is proud of
2. **Network / internet strangers** — people who heard her name and Googled her
3. **Future contracting clients** — non-technical or semi-technical decision-makers
4. **Engineering peers / hiring managers** — depth/rigor signal, but not the primary lens
5. **Founders / product people** — range, taste, product thinking

**Voice & throughline:** *"I love to build cool and useful shit."* Personality is a blend of playful + craftsperson + wry — never childish, never corporate.

---

## 2. Information architecture

Single long-scroll homepage at `tarabird.com` with three case study subpages. No other top-level pages, no blog (LinkedIn + Medium handle writing).

```
tarabird.com
├── /                         (long-scroll homepage)
│   ├── § 00 — Hero
│   ├── § 01 — Builds (3 cards)
│   ├── § 02 — Career (narrative)
│   ├── § 03 — Off-keyboard (impact strips)
│   ├── § 04 — Off the clock (personal beat)
│   └── § 05 — Say hi (contact)
│
├── /builds/severance         (case study)
├── /builds/rollcall          (case study)
└── /builds/knock-it-off      (case study)
```

**Top nav (sticky):** wordmark left → `Builds · Career · Off the clock · Say hi` (pill button) right. Anchor scroll to each section.

**No public code repos** — no "Code ↗" buttons anywhere. Cards link to live URL + case study only.

---

## 3. Visual system

### Direction
**Bold + Soft + Tactile hybrid.** Feminine and modern. Sans-only. Color-block highlights on key words. Soft cream→lavender gradient backgrounds. Hand-drawn mint squiggle accents under section titles. Notion-meets-fashion-brand register.

**Explicit nots:** No serif fonts. No rotated cards. No emoji-as-decoration. No magazine/editorial register. No "WordPress template" feel.

### Color palette

| Token | Hex | Role |
|---|---|---|
| `cream` | `#fef9f0` | Base background |
| `cream-warm` | `#fefcf5` | Card surface |
| `peach-wash` | `#fdf0e8` | Section wash (personal beat) |
| `lavender-wash` | `#f3eef8` | Section wash (career) |
| `lavender` | `#8b7ab8` | Accent — highlights, links, secondary buttons |
| `lavender-deep` | `#5b4380` | Lavender-on-light text |
| `mint` | `#5fc9a0` | Primary accent — highlights, primary CTAs, marquee |
| `forest` | `#1a4a3a` | Display deep tint |
| `ink` | `#0d2820` | Primary text + dark surfaces (contact section) |
| `ink-soft` | `#1a3a2e` | Dark form fields |

**Background gradients used:**
- Hero: `linear-gradient(165deg, #fdf6f0 0%, #fdf6f0 40%, #f3eef8 100%)`
- Career section: `linear-gradient(180deg, #f3eef8, #ede5f5)`
- Personal section: `linear-gradient(180deg, #fef9f0, #fdf0e8)`
- Contact section: solid `ink` (`#0d2820`)

**Organic blur shapes:** large soft-radius radial gradients (`radial-gradient(#5fc9a0, #8b7ab8)`) at 15-25% opacity with 40px blur, positioned partly off-canvas behind hero/career/contact sections. Decorative, non-interactive, no `prefers-reduced-motion` impact.

### Typography

| Token | Font | Weight | Usage |
|---|---|---|---|
| `display` | Inter | 800 | Section titles, hero headline |
| `body` | Inter | 400, 500, 600, 700 | Body, buttons, card titles |
| `mono` | JetBrains Mono | 500, 600 | Section labels, ticker, status pills, metadata |

**Fallbacks:** `Inter, system-ui, -apple-system, sans-serif` for display/body. `'JetBrains Mono', 'SF Mono', Menlo, monospace` for mono.

**No serif fonts. No handwritten/script fonts.** SVG squiggles handle the "tactile" feel without needing a script typeface.

**Display sizing (desktop):**
- Hero headline: 78px / 0.96 line-height / -3.5px tracking
- Section titles (§ 01-05): 46-48px / 1.0 / -2px tracking
- Card title: 20px / 600 / -0.5px tracking
- Body: 17px / 1.55-1.65 line-height
- Mono labels: 10-11px / 1.5-2px letter-spacing / uppercase

### Component library

**Color-block highlight (signature device):**
Inline `<span>` with mint or lavender background, 8-10px border-radius, padding 0 10-14px. Used on emphasized words in section titles ("cool", "useful", "shipped", "got here", "Useful", "Outside", "line"). Carries personality without decorative noise.

**Squiggle underlines:**
Inline SVG path under each section title. Mint or lavender stroke, 3-4px width, organic Bezier curve. Hand-drawn feel without a script font.

```html
<svg width="170" height="14" viewBox="0 0 170 14">
  <path d="M2 8 Q 30 2, 60 8 T 120 8 T 168 8"
        stroke="#5fc9a0" stroke-width="3"
        fill="none" stroke-linecap="round"/>
</svg>
```

**Pill buttons:**
- Primary: `ink` bg, cream text, `border-radius: 24px`, 12px/22px padding, 600 weight
- Secondary: transparent bg, `ink` text, 1.5px `ink` border, same radius/padding
- Hover: subtle 1-2px lift via `transform: translateY(-1px)` + `box-shadow` deepening
- Active: returns to baseline, brief 100ms transition

**Status pills (on cards):**
Small pill, mono font, 9px, uppercase, 1.5-2px letter-spacing, 4px/10px padding, 20px border-radius. Variants: `LIVE` (mint bg, ink text), `FOR THE KIDS` (lavender bg, cream text), `WIP` (kraft bg, ink text).

**Cards:**
- `cream-warm` bg, 1px `#d4cfc1` border, 16px border-radius, hidden overflow
- Header (image area): 170-180px tall, gradient or solid bg, status pill top-right
- Body: 18px padding, mono date label, 20px title, 14px description, action pills row

**Form fields (contact section, on `ink` bg):**
- Background: `ink-soft` (`#1a3a2e`)
- Border: 1px mint
- Text: cream, 14px Inter
- Padding: 12px/14px
- Border-radius: 24px (inputs) / 16px (textarea)
- Focus: mint glow, no harsh outline

**Marquee ticker:**
Mint background, ink text, JetBrains Mono 11px, uppercase, 1.5px letter-spacing, 600 weight. Auto-scrolls right-to-left via CSS `@keyframes`. Pauses on hover.

Content: rotating "now…" status lines. Editable in a single config file so Tara can update it freely.

```
▶ NOW SHIPPING gusto pro integrations ★
rolling at north south jiu jitsu ★
waiting for the caterpillars to hatch ★
re-reading 'a wizard of earthsea' ★
```

---

## 4. Homepage sections

### § 00 — Hero

- **Eyebrow:** mono "hi, i'm tara" with small mint dot
- **Headline:** "I build [cool] & [useful] things." — "cool" in mint highlight pill, "useful" in lavender highlight pill, 78px Inter 800
- **Squiggle underline** in mint below the headline
- **Subhead:** 17px body, max-width 580px — "Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, and a tap-and-knock game for my kids."
- **CTAs:** Primary "See the builds →" / Secondary "Say hi"
- **Background:** cream → lavender gradient with mint+lavender blur shape behind, partially off-canvas right
- **Marquee** sits at the bottom of the hero (full-width, mint bar)

### § 01 — Builds

- **Section label:** mono "01 — builds" in lavender
- **Title:** "Things I've [shipped] lately." — "shipped" in mint highlight
- **Squiggle** underline in lavender
- **Right-rail meta:** "3 selected · 2024 → 2026"
- **3 cards** in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)

**Each card:**
- Header: gradient background + **real product screenshot** (not the CSS mini-mockups from the brainstorm — those were placeholders). Aspect ratio kept consistent across all three cards. Status pill top-right.
- Body: mono date label / 20px title / 14px description (2-3 lines) / action pills

**Card content:**

| Project | Screenshot | Header gradient | Status pill | Live URL | Case study |
|---|---|---|---|---|---|
| **Layoff Calculator** | layoffcalculator.com hero | `linear-gradient(135deg, #0d2820, #1a4a3a)` | LIVE (mint) | layoffcalculator.com | `/builds/severance` |
| **Rollcall** | meetwithrollcall.com/u/tara profile UI (BJJ belt + tags + bio) | `linear-gradient(135deg, #fef9f0, #f3eef8)` | LIVE (mint) | meetwithrollcall.com/u/tara | `/builds/rollcall` |
| **Knock It Off** | knock-it-off.vercel.app "Choose your cat" Waffles/Prince screen | `linear-gradient(180deg, #8a6f5a, #5b3a2a)` | FOR THE KIDS (lavender) | knock-it-off.vercel.app | `/builds/knock-it-off` |

### § 02 — Career

- **Background:** lavender wash gradient with mint+lavender blur shape behind
- **Section label:** mono "02 — career" in lavender-deep
- **Title:** "How I [got here]." — "got here" in mint highlight
- **Squiggle** in mint
- **Body:** 17px Inter, max-width 660px, first-person narrative. Begins with: *"In middle school, my friend taught me to edit Neopets pages with HTML at a sleepover. That was it — I was hooked on shaping the web by hand. I studied advertising at CU Boulder (with a tech-and-media minor), spent my early career in a customer-support seat at a startup called Kapost, attended Women Who Code meetups, and finally bet on a thirteen-week bootcamp called Fullstack Academy when bootcamps still felt like a risk…"*
- **Continues** into Priceline → TadaWeb (Luxembourg) → HelloFresh → Guild Education → Gusto. Full narrative draft is in §11 below.
- **CTAs:** "Read the full story →" expands to show the full narrative, plus "LinkedIn ↗" and "Medium ↗" pill buttons

### § 03 — Off-keyboard (impact strips)

- **Section label:** mono "03 — off-keyboard" in lavender
- **Title:** "[Useful] shit, not software." — "Useful" in mint highlight
- **2 cards** side by side, equal weight:

**Heart & Hammer card:**
- Title: "Heart & Hammer"
- Meta: "501(c)(3) · 2012 → today"
- Description: "A nonprofit my family started for community partnerships and humanitarian giving across NY, NJ, FL, and the Philippines."
- Impact numbers (forest color, 28px, 800 weight):
  - **5,000+** care packages
  - **13 yrs** continuous
  - **4** regions served
- Link: heartandhammer.org

**Kinetic Minds card:**
- Title: "Kinetic Minds"
- Meta: "kid-coding pilot · 2024 → 2025"
- Description: "A creative-coding program for 3rd–5th graders in Montclair. Started with a community fundraiser."
- Impact numbers:
  - **$3,750** seed raised
  - **30%** sponsored seats
  - **6 mo** ran
- Link: kineticmindscreative.com

**Framing decision (locked):** Both get "light touch impact" — brief framing + the numbers, no closure-reason context unless user clicks deeper. The Kinetic Minds family-reason context is intentionally omitted from the public-facing card per Tara's request.

### § 04 — Off the clock

- **Background:** cream → peach wash
- **Section label:** mono "04 — off the clock" in lavender
- **Title:** "[Outside] the IDE." — "Outside" in lavender highlight (cream text)
- **2x2 grid of cards** (1 column on mobile), each with a title + 1-line description:

1. **Jiu-jitsu.** White belt, a year in. I eat my own dog food by tracking every roll on Rollcall.
2. **Gardening.** Slowly turning the yard into something the kids can dig in.
3. **Caterpillar habitats.** Backyard butterfly releases with the three short people I share a roof with.
4. **Snowboarding & hiking.** CU Boulder ruined me forever (in a good way).

**Privacy guardrails:** No kid names. No kid photos. Family-aware framing only ("the three short people I share a roof with"). No mention of school names, neighborhoods beyond Montclair-as-NJ-suburb, or specific addresses.

### § 05 — Say hi

- **Background:** dark `ink` with mint+lavender blur shape
- **Section label:** mono "05 — say hi" in mint
- **Title:** "Drop a [line]." — "line" in mint highlight
- **Subhead:** "Yes I take contract work. No I don't take spec interviews. Most things in between, ask."
- **Form:** name, email (side-by-side), what's up (textarea). All pill-rounded, mint borders, ink-soft fills, cream text.
- **Submit:** mint button, ink text, "Send →"
- **Form backend:** form posts to a serverless endpoint that sends to Tara's inbox. Options: Vercel/Netlify form handlers, Formspree, or a Cloudflare Worker. Decision deferred to implementation plan.
- **Socials:** mono row at bottom — `LinkedIn · Medium · Instagram` (no public GitHub link since no public repos)

### Footer

Thin strip under the contact section, on `ink` bg:
- Left: "© 2026 tarabird"
- Right: "built with Astro · v.0.1"

---

## 5. Case study template

Each of `/builds/severance`, `/builds/rollcall`, `/builds/knock-it-off` follows the same template:

1. **Back link** — `← back to builds` (top-left, mono)
2. **Hero** — same gradient header treatment as the homepage card, scaled to a full hero (45-55vh). Title in 78px Inter 800. Status pill. Eyebrow with role + dates.
3. **At a glance** — small mono-labeled stats strip ("LIVE AT", "STACK", "ROLE", "SHIPPED")
4. **Body sections** — flexible, each project gets a different mix; each section uses the same color-block + squiggle treatment as the homepage. Standard section list:
   - **What it does** — 2-3 paragraphs, plain language
   - **Why I built it** — origin story, personal context
   - **How it works** (engineer-friendly architecture overview, no proprietary detail)
   - **What I'm proud of** — 3-5 specific decisions or wins
   - **What I'd do differently** (optional)
5. **Screenshots / artifacts** — 2-4 large screenshots interspersed in the body. Rounded 16px corners. Captions optional.
6. **Footer CTA** — "Visit ↗" + "Back to builds →" + "Say hi →"

### Per-case-study content guidance

**Severance** (marquee case study, longest):
- Lead with the rigor story: source-cited claims, citation gates at build time, multi-layered trust checks.
- **Mention the automated content engine** as part of "How it works" — but at a high level only. Frame it as: *"a content refresh pipeline that keeps state-by-state data, WARN Act guidance, and equity modeling current — without sacrificing the source-cited rigor."* No mention of LLM provider, model, prompts, or pipeline architecture. No public repo link. Tara wants to avoid enabling reverse-engineering.
- Include the live URL, a hero screenshot of the homepage, a screenshot of a results page if non-sensitive.

**Rollcall:**
- The "I needed this for myself" angle. Personal jiu-jitsu obsession → built the app. Eating-own-dog-food story.
- Brief stack note: Next.js, Supabase, e2e tests, geolocation. Architecture sketch optional.
- Screenshots: profile page (the BJJ belt + tags screenshot already grabbed), maybe one community/connect view.

**Knock It Off** (shortest, most delightful):
- Lead with: "Built this in Godot for my kids who think it's hilarious to put cats on the counter."
- Short and warm. Show the cat-select screen, an in-game shot, maybe the kids-reaction angle (without photos).
- Mention Godot, web export, kid-tested.

---

## 6. Easter eggs & micro-interactions

**Medium-delight register** — never at the cost of load time. All easter eggs are progressive enhancement and gracefully no-op for users with `prefers-reduced-motion: reduce`.

### Always-on micro-interactions
- **Card hover** — 1-2px lift via `transform: translateY(-2px)` + soft shadow deepening. No rotation, no scaling.
- **Link hover** — underline grows from 0 → 100% in mint, 200ms ease-out
- **Button hover** — slight darkening on primary, 1-2px lift, 150ms transition
- **Section scroll-in** — subtle fade-up on first scroll into view (intersection observer), 400ms, easing-out, max 24px translate. Off by default if reduced-motion is set.
- **Squiggle draw-in** — section title squiggles animate `stroke-dashoffset` from full → 0 when section enters viewport. 600ms. One-time per scroll.

### Marquee
- Auto-scrolling ticker bar between hero and builds section. Content lives in a single config file (`src/content/now.ts` or similar) so Tara can edit without touching components. Pauses on hover. CSS-only animation.

### Hidden delights (intentional but not advertised)
- **Konami code** (`↑↑↓↓←→←→ba`) — triggers a small surprise overlay: a tiny cat sprite from Knock It Off walks across the bottom of the screen, knocks a virtual coffee mug off, and disappears. Persists for 4 seconds, then auto-dismisses. Easter egg for engineers who try it.
- **404 page** — themed, voice-aligned ("This page got knocked off the counter. Try a different one ↓") with all main nav links.
- **View source signature** — HTML comment at the top of every page: `<!-- Built by Tara Bird. If you're poking around in here, say hi: tarabird.com#say-hi -->`
- **Hover the wordmark** in the nav for ~3 seconds → the dot beside it briefly pulses mint→lavender→mint. Tiny throwaway delight.

### Deferred to phase 2 (not in v1)
- Cursor effects, parallax, fancy scroll-jacking, anything that would require a heavy JS dependency.

---

## 7. Tech stack & deployment

### Stack
- **Framework:** Astro 5+
- **Styling:** Tailwind CSS 4 + a small custom CSS layer for the design tokens (color, gradient utilities, squiggle helpers)
- **Content:** MDX for the career narrative and case studies; TypeScript constants for marquee items, off-the-clock list, etc.
- **Type:** Inter (variable) + JetBrains Mono via `@fontsource-variable` packages, self-hosted (no Google Fonts CDN)
- **Icons:** Lucide (tree-shakeable, small footprint)
- **Form:** Vercel Forms (deferred decision; Formspree or a Cloudflare Worker are fallback options)
- **Analytics:** Plausible (privacy-respecting, lightweight) or none — Tara's call
- **No public Git repos referenced anywhere on the site**

### Deployment
- **Host:** Vercel (free tier, integrates cleanly with Astro)
- **Domain:** `tarabird.com` (Tara to acquire; `.dev` fallback if unavailable)
- **HTTPS:** automatic via Vercel
- **Performance budget:**
  - Total JS shipped: < 30 KB compressed
  - Largest Contentful Paint: < 1.5s on 3G
  - Lighthouse Performance, Accessibility, Best Practices, SEO: 95+ each
- **No client-side framework runtime** — Astro static export, JS only for marquee, scroll observer, konami code, contact form

### File / repo structure (proposed)
```
tarabird/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── og-image.png
│   └── screenshots/
│       ├── severance-hero.png
│       ├── rollcall-profile.png
│       └── knock-it-off-cat-select.png
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── builds/
│   │       ├── severance.mdx
│   │       ├── rollcall.mdx
│   │       └── knock-it-off.mdx
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Marquee.astro
│   │   ├── BuildCard.astro
│   │   ├── ImpactStrip.astro
│   │   ├── ContactForm.astro
│   │   ├── Squiggle.astro
│   │   └── KonamiSurprise.astro
│   ├── content/
│   │   ├── now.ts            (marquee items)
│   │   ├── builds.ts         (build card data)
│   │   ├── off-the-clock.ts  (personal beat items)
│   │   └── career.mdx        (full narrative)
│   ├── styles/
│   │   └── tokens.css
│   └── layouts/
│       ├── Base.astro
│       └── CaseStudy.astro
└── docs/
    └── superpowers/specs/...
```

---

## 8. Voice & copy guidelines

- **Direct, slightly irreverent, never edgy for its own sake.** Hardest rule: if a line would make Tara cringe to read out loud, kill it.
- **Use "shit" sparingly and intentionally** — it appears in the headline and once or twice elsewhere ("Useful shit, not software."). It's the salt; not the dish.
- **Lowercase for warmth.** Mono labels and tickers are uppercase for structure. Body and headlines stay sentence-case.
- **First person, always.** "I built", "I shipped", "I'm working on" — never "we" unless it's literally a team output (Heart & Hammer, Kinetic Minds, Gusto team work).
- **No "passionate about" or "I'm a results-driven engineer" or any LinkedIn-isms.**
- **Numbers > adjectives.** Where possible, lead with a number ("5,000+ care packages", "+57% PR throughput") instead of an adjective ("massive impact").

---

## 9. Privacy & content boundaries

**Explicitly off-limits:**
- Kid names (Avery, Ralph, Natalie — referenced in Tara's memory but not on the site)
- Kid photos
- School names or specific neighborhoods beyond "Montclair, NJ"
- Specific employer-internal details from Gusto beyond what's already in Tara's pre-approved Gusto draft (no customer names, no incident details, no proprietary tooling specifics)
- The reason for Kinetic Minds closing (Ralph's illness) — kept private at Tara's request
- Layoff Calculator implementation details that would enable reverse-engineering of the content pipeline

**Explicitly OK:**
- Tara's age (35), city (NYC metro / Montclair), publicly-shipped product details
- The Heart & Hammer impact numbers (already public on heartandhammer.org)
- The Kinetic Minds achievement numbers (already public via her fundraiser)
- Gusto role, team size, and the publicly-shareable accomplishments in the Gusto draft (Section 11 of the spec)
- Personal hobby mentions: jiu-jitsu (white belt at North South), gardening, snowboarding, hiking, caterpillar habitats

---

## 10. Implementation phases

**Phase 1 — MVP (this spec):**
- Homepage + 3 case studies + 404
- All sections fully built with placeholder content where final copy isn't ready
- Real product screenshots in build cards
- Marquee live with initial 4-6 items
- Contact form sending to Tara's inbox
- Konami easter egg
- Deployed to tarabird.com

**Phase 2 — Polish (post-launch):**
- Commissioned/AI-generated paper-cut illustrations as small section motifs (if Tara still wants them after seeing the site live without)
- More easter eggs / micro-interactions
- Light analytics
- Possible blog section (defer until there's content)

---

## 11. Source content (paste-into-build-ready)

### Hero copy

> **Eyebrow:** hi, i'm tara
>
> **Headline:** I build [cool] & [useful] things.
>
> **Subhead:** Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, and a tap-and-knock game for my kids.

### Marquee items (initial)
1. `NOW SHIPPING gusto pro integrations`
2. `rolling at north south jiu jitsu`
3. `waiting for the caterpillars to hatch`
4. `re-reading 'a wizard of earthsea'`

(Editable in `src/content/now.ts`. Aim for 4-6 active items.)

### Career narrative (long form, paste into `src/content/career.mdx`)

**Chapter 1 — Where it started.**

In middle school, my friend taught me to edit Neopets pages with HTML at a sleepover. That was it. I spent the next decade quietly learning HTML, CSS, and JavaScript by changing how my homepage looked, then how other people's homepages looked, then everything I could get my hands on.

I went to the University of Colorado at Boulder to study advertising — with a minor in Technology, Arts & Media. (I also learned to love snowboarding, hiking, and camping, and never quite shook any of them.)

My first job out of college was a customer-support seat at a startup called Kapost in Boulder. I was sitting next to the engineering team and watching how they worked, and the old itch came back hard. I started going to Women Who Code meetups with friends — shoutout to my still-best-friend Kinsey Durham Grace, now at GitHub — and we taught ourselves Ruby on Rails. After a couple of years of that, I bet on a brand-new thirteen-week coding school called Fullstack Academy, when bootcamps still felt like a real risk. Thirteen weeks of MEAN stack later, I was ready.

**Chapter 2 — Off to the races.**

My first move after Fullstack was driven by fear of unemployment. I declined the final rounds at Refinery29 and took the first offer I got. That startup folded within months. A bootcamp classmate then helped me into Priceline.com — and that's the moment I knew this was my career, not a phase.

At Priceline, I rebuilt the legacy checkout flow in Angular for both desktop and mobile web. Then I moved abroad to **TadaWeb in Luxembourg City** for a chapter that was honestly more about living in Europe and traveling than any one shipped project.

Back in the U.S., I joined **HelloFresh** as a Staff Engineer with the intent of growing into management. I joined their six-month squad-lead-in-training program and fell in love with mentoring engineers — that's where I figured out that growing people into their full potential was the work I most wanted to do.

Then **Guild Education**, where I worked on cleaning and validating large datasets from academic partners to power revenue and revshare.

**Chapter 3 — Today, at Gusto.**

I'm an Engineering Manager at Gusto, leading the Pro Integrations team — the connections between Gusto's payroll and accounting platform and the external tools accountants rely on (QuickBooks Online, Xero, FreshBooks, Sage Intacct, and a new partner integration delivered to closed beta in 2026). I lead a team of five engineers spanning Senior through Senior Staff.

In a single recent quarter, my team delivered a new partner integration end-to-end, cut sync error rates from 15% to 7%, reduced average time-to-resolve from twenty days to nine, removed approximately 15,000 lines of legacy code and millions of obsolete rows as part of a multi-quarter monolith extraction, and migrated 85 GraphQL objects to a new authorization layer. We drove a 92% reduction in weekly production errors in the closing weeks of the quarter and posted a +57% PR throughput gain during an AI-tooling sprint.

Alongside leading the team, I invest in engineering management *infrastructure* — lightweight automations, dashboards, and structured review formats that scale a single manager's effectiveness. A monthly operational review automation, an on-call rotation dashboard, a project-sync coordination layer, a structured calibration report format. None of these replaces management judgment. They free up more attention for it.

> *Want the short version? [Elevator pitch](#) · [LinkedIn ↗](https://linkedin.com/in/tleriasbird) · [Medium ↗](https://medium.com/@tleriasbird)*

### Off-the-clock copy (final, paste into `src/content/off-the-clock.ts`)

1. **Jiu-jitsu.** White belt, a year in. I eat my own dog food by tracking every roll on Rollcall.
2. **Gardening.** Slowly turning the yard into something the kids can dig in.
3. **Caterpillar habitats.** Backyard butterfly releases with the three short people I share a roof with.
4. **Snowboarding & hiking.** CU Boulder ruined me forever (in a good way).

### Contact section copy

> **Eyebrow:** § 05 — say hi
>
> **Title:** Drop a [line].
>
> **Subhead:** Yes I take contract work. No I don't take spec interviews. Most things in between, ask.

### Footer copy

> © 2026 tarabird · built with Astro · v.0.1

---

## 12. Open items deferred to implementation plan

- Final font choice within the Inter family vs. variable-weight licensing details (default: `@fontsource-variable/inter`)
- Form backend: Vercel Forms vs. Formspree vs. Cloudflare Worker (recommendation: start with Vercel built-in)
- Whether to include light analytics (Plausible recommended if yes)
- Source for the real product screenshots — re-capture during build with consistent device frame
- Commission vs. AI-generate the optional Phase 2 paper-cut motifs

---

*End of design spec. Ready for review.*
