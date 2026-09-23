# Homepage Skills Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "What you can hire me for" section to the homepage — four capability lanes, each carrying its own proof number — plus the supporting copy changes that move the contract CTA out of the footer.

**Architecture:** Astro static site. The new section follows the existing `BuildsSection`/`BuildCard` split *architecturally* (a section shell mapping content data into a per-item component) but **not visually** — it renders stacked rows, not a card grid, because the page already has two grid-of-cards sections. Content lives in a typed array validated by Zod at test time, same as every other content file.

**Tech Stack:** Astro 6, Tailwind 4 (`@theme` tokens in `src/styles/tokens.css`), Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-22-homepage-skills-design.md`. Read §5 (metric provenance), §7 (section content) and §13 (coordination) before starting.

---

## Prerequisite: land the fair-roads plan first

`docs/superpowers/plans/2026-09-23-fair-roads-case-study.md` must be complete before **Task 7** here. That plan adds a fourth build, and this plan's lane 01 stat reads `4`.

Two hard couplings:

- **Task 7 adds `stack` to `BuildSchema` as a required field.** It must be added to **all four** build entries, including `fair-roads`. The fair-roads plan deliberately does not add it — the field does not exist yet at that point — so if you skip the fourth entry here, `z.array(BuildSchema).parse(builds)` throws and the suite fails.
- **Do not touch `BuildsSection.astro`'s grid classes.** The fair-roads plan owns that change (`md:grid-cols-3` → `md:grid-cols-2`). Two plans editing one line is how conflicts happen.

If fair-roads has not landed, Tasks 1–6 and 8 are still safe to do; stop before Task 7. Lane 01's `statValue` would then read `4` while only three builds exist — editorially wrong for as long as that lasts, but nothing breaks, because `statValue` is a free string with no code link to `builds.length`.

**Not a task, and not the implementer's to do:** spec §5 records an open action for Tara — confirm `15% → 7%` and `20 days → 9` against the original Gusto dashboards before this merges. Every number in Task 2 traces to prose she wrote, not to data in this repo. Flag it at the end; do not block on it.

---

## File structure

| File | Responsibility | Change |
|---|---|---|
| `src/content/schema.ts` | Zod shapes | Add `ServiceSchema`; add `stack` to `BuildSchema` |
| `src/content/services.ts` | The four lanes | Create |
| `src/components/Tag.astro` | One pill chip | Create — shared by service rows and build cards so they cannot drift |
| `src/components/ServiceRow.astro` | One lane row | Create |
| `src/components/SkillsSection.astro` | Section shell | Create |
| `src/styles/tokens.css` | Design tokens | Add `--gradient-services` |
| `src/pages/index.astro` | Homepage composition | Insert `<SkillsSection />` |
| `src/components/CareerSection.astro` | — | Renumber `02` → `03` |
| `src/components/OffKeyboardSection.astro` | — | Renumber `03` → `04` |
| `src/components/OffTheClockSection.astro` | — | Renumber `04` → `05` |
| `src/components/ContactSection.astro` | — | Renumber literal `05` → `06`; expand contract copy |
| `src/components/BuildCard.astro` | — | Render stack tags |
| `src/components/Hero.astro` | — | Subhead clause; retarget secondary CTA |
| `src/components/Nav.astro` | — | Add "What I do" link |
| `src/content/__tests__/content.test.ts` | Validation | Add service assertions; extend build assertions |

---

## Task 1: ServiceSchema

**Files:**
- Modify: `src/content/schema.ts`
- Test: `src/content/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/content/__tests__/content.test.ts` — import `ServiceSchema` from `'../schema'` at the top, alongside the existing schema imports:

```ts
  it('service schema rejects too few and too many tags', () => {
    const base = {
      slug: 'ship', title: 'x', description: 'x',
      statValue: '4', statCaption: 'x', tags: ['a', 'b'],
    };
    expect(() => ServiceSchema.parse(base)).not.toThrow();
    expect(() => ServiceSchema.parse({ ...base, tags: ['a'] })).toThrow();
    expect(() => ServiceSchema.parse({ ...base, tags: ['a','b','c','d','e','f'] })).toThrow();
    expect(() => ServiceSchema.parse({ ...base, statCaption: '' })).toThrow();
  });
```

The bounds are 2–5, not a fixed count: lane 01 carries five tags after absorbing the ML work, while lanes 03 and 04 carry two.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL — `ServiceSchema is not defined`

- [ ] **Step 3: Add the schema**

Append to `src/content/schema.ts`:

```ts
export const ServiceSchema = z.object({
  slug: z.enum(['ship', 'integrate', 'lead', 'enable']),
  title: z.string().min(1),
  description: z.string().min(1),
  statValue: z.string().min(1),
  statCaption: z.string().min(1),
  tags: z.array(z.string().min(1)).min(2).max(5),
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- content.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/schema.ts src/content/__tests__/content.test.ts
git commit -m "feat(schema): add ServiceSchema for the skills section"
```

---

## Task 2: The four lanes

Read spec §5 before writing the stat values. Two rules bind this file:

- **`−92%` weekly production errors must not appear.** Its source qualifier is "in the closing weeks of the quarter", which a bare stat tile cannot carry. Lane 03 uses time-to-resolve instead.
- **Gusto metrics say "teams I led"**, never bare "I". Solo builds say "built alone".

**Files:**
- Create: `src/content/services.ts`
- Modify: `src/content/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/content/__tests__/content.test.ts` (import `services` from `'../services'` at the top):

```ts
  it('services match schema', () => {
    expect(() => z.array(ServiceSchema).parse(services)).not.toThrow();
    expect(services.length).toBe(4);
    const slugs = services.map(s => s.slug);
    expect(slugs).toEqual(['ship', 'integrate', 'lead', 'enable']);
  });

  it('gusto metrics are attributed to teams, not to one person', () => {
    const gusto = services.filter(s => ['integrate', 'lead'].includes(s.slug));
    expect(gusto).toHaveLength(2);
    for (const s of gusto) {
      expect(s.statCaption).toContain('teams I led');
    }
  });

  it('the withdrawn production-error metric never ships', () => {
    const blob = JSON.stringify(services);
    expect(blob).not.toContain('92');
    expect(blob).not.toContain('production error');
  });
```

The third test is a regression guard, not a style check — spec §5 excludes that figure because its measurement window cannot survive a stat tile.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL — cannot resolve `'../services'`

- [ ] **Step 3: Create the content file**

```ts
import type { z } from 'zod';
import type { ServiceSchema } from './schema';

type Service = z.infer<typeof ServiceSchema>;

export const services: Service[] = [
  {
    slug: 'ship',
    title: 'Ship the whole product, model included.',
    description: 'Idea to shipped thing, solo. Design, build, deploy, the unglamorous parts after launch — and when the product is a model, train, evaluate and export that too.',
    statValue: '4',
    statCaption: 'products shipped, built alone',
    tags: ['Next.js', 'Supabase', 'PyTorch', 'ONNX', 'Godot'],
  },
  {
    slug: 'integrate',
    title: 'Make systems talk.',
    description: 'Partner APIs, accounting platforms, sync pipelines that fail quietly until someone makes them stop.',
    statValue: '15% → 7%',
    statCaption: 'sync errors · teams I led',
    tags: ['QuickBooks', 'Xero', 'Sage Intacct'],
  },
  {
    slug: 'lead',
    title: 'Run the engineering team.',
    description: 'Fractional tech leadership. On-call rotations, ops reviews, calibration — the infrastructure that makes leadership scale.',
    statValue: '20 days → 9',
    statCaption: 'time-to-resolve · teams I led',
    tags: ['2 teams', '5 engineers'],
  },
  {
    slug: 'enable',
    title: 'Get a team productive with new tools.',
    description: 'AI tooling adoption, workshops, and teaching people who have never written a line of code.',
    statValue: '58%',
    statCaption: 'PR throughput · 2-team sprint, DX-confirmed',
    tags: ['AI tooling', 'Workshops'],
  },
];
```

`20 days → 9`, not `20d → 9d`: the value is read aloud by a screen reader inside the `<dl>` built in Task 4.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add src/content/services.ts src/content/__tests__/content.test.ts
git commit -m "feat(content): the four service lanes"
```

---

## Task 3: Tag component

Extracted rather than inlined because two consumers use it — service rows here and build cards in Task 6 — and duplicated chip styling would drift.

**Files:**
- Create: `src/components/Tag.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props { label: string; }
const { label } = Astro.props;
---
<span class="inline-block font-mono text-[9.5px] font-semibold uppercase tracking-[0.7px] border border-mint text-ink/75 rounded-full px-2 py-[5px] whitespace-nowrap">
  {label}
</span>
```

Transparent background with a mint border, deliberately: `StatusPill` already owns filled pills, and a second filled-pill style would read as the same thing meaning something different.

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds. (Nothing imports it yet — this only checks the file parses.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Tag.astro
git commit -m "feat(ui): Tag chip, shared by service rows and build cards"
```

---

## Task 4: ServiceRow

**Files:**
- Create: `src/components/ServiceRow.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Tag from './Tag.astro';
import type { z } from 'zod';
import type { ServiceSchema } from '../content/schema';

interface Props {
  service: z.infer<typeof ServiceSchema>;
  index: number;
}
const { service, index } = Astro.props;
const num = String(index + 1).padStart(2, '0');
---
<li class="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(220px,0.9fr)] max-[820px]:grid-cols-1 items-center gap-[22px] max-[820px]:gap-2.5 py-5 border-b border-card-border">
  <div>
    <div class="font-mono text-[10px] font-bold tracking-[1.5px] text-ink/40">{num}</div>
    <h3 class="font-display font-bold text-[20px] leading-[1.2] mt-1" style="letter-spacing:-0.025em">{service.title}</h3>
  </div>

  <p class="text-[13px] leading-[1.5] text-ink/75">{service.description}</p>

  <div class="flex gap-[22px] items-center flex-wrap">
    <dl class="flex flex-col-reverse m-0">
      <dt class="font-mono text-[9.5px] font-medium uppercase tracking-[0.8px] text-ink/55 mt-1.5 max-w-[160px]">{service.statCaption}</dt>
      <dd class="font-display font-extrabold text-[24px] leading-none text-forest m-0" style="letter-spacing:-0.025em">{service.statValue}</dd>
    </dl>
    <div class="flex flex-col max-[820px]:flex-row max-[820px]:flex-wrap gap-1.5 items-end max-[820px]:items-start">
      {service.tags.map(t => <Tag label={t} />)}
    </div>
  </div>
</li>
```

Three details that matter:

1. **The grid template is identical on every row and the third column is `minmax(220px, 0.9fr)`, not `auto`.** Stat strings differ in length; `auto` would let each row's columns land in a different place, and the section would look misaligned rather than tabular.
2. **`<dt>` comes before `<dd>` in the DOM**, which is what HTML requires, and `flex-col-reverse` flips them visually so the big number sits on top. A screen reader announces "time-to-resolve, teams I led: 20 days to 9" rather than a naked "20 days → 9".
3. **`<li>`** because the section wraps these in a `<ul>` — four parallel items are a list, and a screen reader announcing "list, 4 items" is useful here.

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ServiceRow.astro
git commit -m "feat(ui): ServiceRow with accessible stat markup"
```

---

## Task 5: SkillsSection and its background token

**Files:**
- Modify: `src/styles/tokens.css` (the `:root` gradient block, around lines 32-36)
- Create: `src/components/SkillsSection.astro`

- [ ] **Step 1: Add the gradient token**

In `src/styles/tokens.css`, inside the existing `:root { ... }` block alongside the other gradients:

```css
  --gradient-services: linear-gradient(180deg, #fef9f0, #f3eef8);
```

This walks `cream` → `lavender-wash`, which also sets up `--gradient-career` in the section immediately below. Do **not** use `bg-cream-warm`: it is ~0.5% lighter than `cream` (invisible against the Builds section above), and throughout this codebase `cream-warm` means *card surface*, never a section background.

- [ ] **Step 2: Create the section**

```astro
---
import SectionHeader from './SectionHeader.astro';
import Highlight from './Highlight.astro';
import BlurShape from './BlurShape.astro';
import ScrollFadeIn from './ScrollFadeIn.astro';
import ServiceRow from './ServiceRow.astro';
import { services } from '../content/services';
---
<section id="what-i-do" class="relative border-b border-card-border/40" style="background:var(--gradient-services)">
  <BlurShape size={220} opacity={0.15} position="top:60px;left:-80px" />
  <div class="relative z-10 max-w-6xl mx-auto px-8 py-16">
    <div class="flex justify-between items-end mb-6 flex-wrap gap-4">
      <SectionHeader number="02" label="what i do" squiggleColor="mint" squiggleWidth={200}>
        What you can <Highlight color="mint">hire me</Highlight> for.
      </SectionHeader>
      <div class="font-mono text-[10px] text-ink/50">taking on work · 2026</div>
    </div>

    <ScrollFadeIn>
      <ul class="list-none p-0 m-0 border-t border-card-border">
        {services.map((service, i) => (<ServiceRow service={service} index={i} />))}
      </ul>

      <div class="mt-7">
        <a href="#say-hi" class="inline-block font-mono text-[11px] uppercase tracking-[1.5px] font-semibold text-ink border-b-[1.5px] border-mint pb-0.5 hover:text-mint transition-colors">
          Any of these sound like your problem? →
        </a>
      </div>
    </ScrollFadeIn>
  </div>
</section>
```

**`SectionHeader` has no `kicker` prop** — its props are `number`, `label`, `squiggleColor`, `squiggleWidth`, `labelColor`. The kicker is a sibling `<div>` inside a `flex justify-between items-end` wrapper, copying `BuildsSection.astro:14`. Do not add a prop for it.

`id="what-i-do"` is required — it is the anchor target for both the hero CTA (Task 7) and the nav link.

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/components/SkillsSection.astro
git commit -m "feat(ui): SkillsSection shell and its gradient token"
```

---

## Task 6: Wire it in, and renumber everything below it

Inserting § 02 pushes every following section number up by one. **All four numbers are hardcoded literals** — there is no derivation. Miss one and the page ships with two `02`s.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/CareerSection.astro:11`
- Modify: `src/components/OffKeyboardSection.astro:10`
- Modify: `src/components/OffTheClockSection.astro:9`
- Modify: `src/components/ContactSection.astro:9`

- [ ] **Step 1: Insert the section**

In `src/pages/index.astro`, add the import alongside the others:

```astro
import SkillsSection from '../components/SkillsSection.astro';
```

and place it between `<BuildsSection />` and `<CareerSection />`:

```astro
    <BuildsSection />
    <SkillsSection />
    <CareerSection />
```

- [ ] **Step 2: Renumber the four sections below**

| File | Line | From | To |
|---|---|---|---|
| `CareerSection.astro` | 11 | `number="02"` | `number="03"` |
| `OffKeyboardSection.astro` | 10 | `number="03"` | `number="04"` |
| `OffTheClockSection.astro` | 9 | `number="04"` | `number="05"` |
| `ContactSection.astro` | 9 | `05 / say hi` | `06 / say hi` |

`ContactSection` does **not** use `SectionHeader` — it hand-rolls its header markup and has no `Squiggle`. That is a pre-existing inconsistency; edit the literal string and leave it otherwise alone.

- [ ] **Step 3: Verify the numbering by reading the rendered page**

Run:

```bash
npm run build && grep -oE '0[0-9] / [a-z -]+' dist/index.html | sort
```

Expected, each exactly once:

```
01 / builds
02 / what i do
03 / career
04 / off-keyboard
05 / off the clock
06 / say hi
```

If any number appears twice, a renumber was missed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/CareerSection.astro src/components/OffKeyboardSection.astro src/components/OffTheClockSection.astro src/components/ContactSection.astro
git commit -m "feat(home): insert the skills section and renumber below it"
```

---

## Task 7: Stack tags on build cards

**Requires the fair-roads plan to have landed** — see Prerequisite. `stack` is required with no default, so every build entry needs one.

**Files:**
- Modify: `src/content/schema.ts` (`BuildSchema`)
- Modify: `src/content/builds.ts` (all four entries)
- Modify: `src/components/BuildCard.astro`
- Modify: `src/content/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test**

Replace the `builds match schema` test body:

```ts
  it('builds match schema', () => {
    expect(() => z.array(BuildSchema).parse(builds)).not.toThrow();
    const slugs = builds.map(b => b.slug);
    expect(slugs).toEqual(['fair-roads', 'severance', 'rollcall', 'knock-it-off']);
  });

  it('every build carries a stack', () => {
    expect(builds.every(b => b.stack.length > 0)).toBe(true);
  });
```

Note this drops `expect(builds.length).toBe(4)` — the slug assertion already pins both the count and the order, and two assertions of the same fact is one more place to forget to update.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL — `Property 'stack' does not exist`

- [ ] **Step 3: Add the field to the schema**

In `src/content/schema.ts`, add to `BuildSchema` after `gradientHeader`:

```ts
  stack: z.array(z.string().min(1)).min(1),
```

- [ ] **Step 4: Add stack to all four builds**

In `src/content/builds.ts`, add to each entry. The three existing values are lifted from the case-study MDX frontmatter, where they live as `·`-joined strings inside the `stats` array — author them here as explicit arrays rather than splitting at runtime:

- `fair-roads` → `stack: ['DINOv2 ViT-S/14', 'UPerNet', 'ONNX'],`
- `severance` → `stack: ['Next.js', 'TypeScript', 'Supabase'],`
- `rollcall` → `stack: ['Next.js', 'Supabase', 'Playwright'],`
- `knock-it-off` → `stack: ['Godot 4.6', 'GDScript'],`

This duplicates the values across `builds.ts` and the MDX frontmatter. That is accepted — they are two presentations with different lifetimes, and the case-study `stats` block also carries non-stack rows. If they drift, `builds.ts` is authoritative for the homepage.

- [ ] **Step 5: Render the tags**

In `src/components/BuildCard.astro`, add the import:

```astro
import Tag from './Tag.astro';
```

and insert between the description `<p>` and the button row:

```astro
    <div class="flex flex-wrap gap-1.5 mt-3">
      {build.stack.map(t => <Tag label={t} />)}
    </div>
```

- [ ] **Step 6: Run the tests**

Run: `npm test && npm run build`
Expected: all pass, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/content/schema.ts src/content/builds.ts src/components/BuildCard.astro src/content/__tests__/content.test.ts
git commit -m "feat(builds): show each build's stack on its card"
```

---

## Task 8: Hero, contact and nav copy

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/ContactSection.astro`
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Hero subhead and CTA**

In `src/components/Hero.astro`, replace the subhead paragraph text:

```astro
      <p class="text-[17px] leading-[1.6] mt-6 max-w-xl text-ink/90">
        Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, a road-mapping model for humanitarian work, and a tap-and-knock game for my kids. And yes, I'm taking contract work.
      </p>
```

and retarget the secondary button:

```astro
        <Button href="#what-i-do" variant="secondary">What I can do →</Button>
```

The fourth product is named here because lane 01 claims `4` a section later, and a reader who counts will notice. "Say hi" stays reachable from the nav button, which is always visible.

- [ ] **Step 2: Contact copy**

In `src/components/ContactSection.astro`, replace the paragraph under the heading:

```astro
    <p class="text-[14px] mt-3 max-w-md text-cream/75">
      Yes I take contract work — shipping a product end to end, wiring up integrations, running your engineering team, or getting the team you have moving faster. Tell me what you're building.
    </p>
```

- [ ] **Step 3: Nav link**

In `src/components/Nav.astro`, add to the `links` array, second:

```ts
  { href: '#builds', label: 'Builds' },
  { href: '#what-i-do', label: 'What I do' },
  { href: '#career', label: 'Career' },
  { href: '#off-the-clock', label: 'Off the clock' },
```

This makes a fourth link in a bar whose links are already `hidden sm:inline`. Check it at `sm` (640px) in Step 4. **If it crowds, drop the Career link** — not "What I do", and do not move Career to the footer: `Footer.astro` has no nav links at all, so that would mean designing a footer nav, which is out of scope here. Career stays reachable from its own section and from `/career`.

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `http://localhost:4321`.

- Hero secondary button scrolls to the new section
- Nav "What I do" scrolls to the same place
- At 640px wide, the nav does not wrap or overflow
- The skills section's closing link scrolls to the contact form

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/ContactSection.astro src/components/Nav.astro
git commit -m "feat(home): promote the contract CTA out of the footer"
```

---

## Task 9: Verify the whole change

- [ ] **Step 1: Tests and build**

Run: `npm test && npm run build && npx astro check`
Expected: all pass, no new type errors.

- [ ] **Step 2: Column alignment**

Run: `npm run preview`, open `http://localhost:4321/#what-i-do`.

Expected: all four rows' columns line up vertically — titles start at the same x, descriptions start at the same x, stats start at the same x. If any row is offset, the grid template is not identical across rows; check `ServiceRow.astro`'s third column is `minmax(220px,0.9fr)` and not `auto`.

- [ ] **Step 3: Responsive**

Narrow the window through 820px.
Expected: rows collapse to a single stacked column; tag chips reflow from a vertical column to a horizontal wrap; no horizontal page scroll at 375px.

- [ ] **Step 4: Screen reader check on the stats**

With VoiceOver (⌘F5), navigate to lane 03's stat.
Expected: announced as caption-then-value — "time-to-resolve, teams I led: 20 days to 9" — not as a bare "20 days → 9". If it reads the value alone, the `<dt>`/`<dd>` pairing is wrong.

- [ ] **Step 5: Re-measure Lighthouse**

Run: `npm run preview`, then Lighthouse against `http://localhost:4321`.
Record the four scores in `README.md`'s table, dated. Do not assume 99/95/100/100 holds — this change adds four `<dl>` structures and two new tag clusters, and accessibility was already the weakest score at 95.

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: re-measure Lighthouse after the skills section"
```

---

## Task 10: Correct the PR-throughput figure on /career

Spec §5 requires this in the same change as the skills section. `career.astro` currently says `+57%`; the resume says `58%`, DX-confirmed. Shipping lane 04 as `58%` while `/career` says `+57%` puts a contradiction two clicks apart, on exactly the kind of number a reader checks.

**Files:**
- Modify: `src/pages/career.astro:43`

- [ ] **Step 1: Correct the figure**

In `src/pages/career.astro:43`, change:

```
posted a <strong>+57% PR throughput gain</strong> during an AI-tooling sprint
```

to:

```
posted a <strong>58% PR throughput gain</strong> across a two-team AI-tooling sprint, confirmed by our developer-experience metrics
```

Leave every other number in that sentence alone — this task corrects one figure, it does not rewrite the paragraph.

- [ ] **Step 2: Verify no `+57%` survives anywhere**

Run:

```bash
grep -rn "57%" src/ docs/superpowers/specs/ || echo "clean"
```

Expected: no hits in `src/`. Hits inside the spec are fine where they describe the correction itself.

- [ ] **Step 3: Commit**

```bash
git add src/pages/career.astro
git commit -m "fix(career): PR throughput is 58%, DX-confirmed"
```
