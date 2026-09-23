# fair-roads Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth build, `fair-roads`, as the first card on the homepage builds grid and a full case study at `/builds/fair-roads`.

**Architecture:** Astro static site. Build data lives in a typed array (`src/content/builds.ts`) validated by Zod at test time; the homepage maps over it into `BuildCard`, and each build has an MDX page using the shared `CaseStudy` layout. This change adds one array entry, widens two Zod enums, adds one optional field, adjusts a grid, and writes one MDX page.

**Tech Stack:** Astro 6, MDX, Tailwind 4 (`@theme` tokens in `src/styles/tokens.css`), Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-22-fair-roads-case-study-design-v2.md`. Read §5 (page copy and register), §8 (ordering, stats strip, numbers budget) and §10 (do not quote) before starting. **Do not** implement `2026-09-22-fair-roads-case-study-design.md` on `main` — it is superseded and factually wrong.

**Land this plan before the homepage-skills plan.** It changes the build count that the other plan's lane 01 stat depends on.

---

## Prerequisite (blocking, not a task in this repo)

`public/screenshots/fair-roads-hero.png` must exist before Task 6. `BuildCard.astro` renders `<img src={build.screenshot}>` unconditionally, so a missing file is a broken image on the **first** card on the homepage.

- The image is generated in the `fair-roads` repository (`/Users/tarabird/Workspace/fair-roads`), not here.
- It must be rendered from the **four-city** checkpoint. The existing overlays in that repo were produced by the superseded Khartoum-only checkpoint; using one without regenerating means the page implies the figures show the released model, which spec §9 forbids.
- Match the existing assets' shape: `public/screenshots/severance-hero.png` and siblings. Check with `file public/screenshots/*.png`.
- `heroImage` on the case study is **optional** (`CaseStudy.astro:40` guards it), so `fair-roads-pred-vs-gt.png` is nice-to-have and does not block.

**Do not substitute a placeholder image.** A stand-in on the first card either misrepresents the model or looks unfinished. If the asset is not ready, stop after Task 5 and leave the entry uncommitted.

---

## File structure

| File | Responsibility | Change |
|---|---|---|
| `src/content/schema.ts` | Zod shapes for all content | Widen `slug` and `status` enums; add optional `statusLabel` |
| `src/content/builds.ts` | The build list, in display order | Add `fair-roads` as the **first** element |
| `src/content/__tests__/content.test.ts` | Content validation | Update count and slug-order assertions |
| `src/components/BuildCard.astro` | One homepage build card | Pass `statusLabel` through to `StatusPill` |
| `src/layouts/CaseStudy.astro` | Shared case-study layout | Widen `status` Props; pass `statusLabel` |
| `src/components/BuildsSection.astro` | The builds grid | `md:grid-cols-3` → `md:grid-cols-2` |
| `src/pages/builds/fair-roads.mdx` | The case study page | Create |

`StatusPill.astro` needs **no change** — it already accepts `variant="wip"` and an optional `label`.

---

## Task 1: Widen the schema

**Files:**
- Modify: `src/content/schema.ts:5-16`
- Test: `src/content/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/content/__tests__/content.test.ts`, inside the `describe('content data', ...)` block:

```ts
  it('build schema accepts the fair-roads shape', () => {
    const entry = {
      slug: 'fair-roads',
      title: 'fair-roads',
      oneLine: 'x',
      description: 'x',
      dates: '2026 → ongoing',
      liveUrl: 'https://huggingface.co/tarabird90/dinov2s-roads',
      liveLabel: 'Model card ↗',
      status: 'wip',
      statusLabel: 'OPEN WEIGHTS',
      screenshot: '/screenshots/fair-roads-hero.png',
      gradientHeader: 'linear-gradient(135deg, #2a1810 0%, #5c3420 100%)',
    };
    expect(() => BuildSchema.parse(entry)).not.toThrow();
  });

  it('statusLabel is optional', () => {
    const { statusLabel, ...withoutLabel } = {
      slug: 'severance', title: 'x', oneLine: 'x', description: 'x', dates: 'x',
      liveUrl: 'https://example.com', liveLabel: 'x', status: 'live',
      statusLabel: 'x', screenshot: 'x', gradientHeader: 'x',
    };
    expect(() => BuildSchema.parse(withoutLabel)).not.toThrow();
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL — `Invalid enum value. Expected 'severance' | 'rollcall' | 'knock-it-off', received 'fair-roads'`

- [ ] **Step 3: Widen the enums and add the field**

In `src/content/schema.ts`, replace the `slug` and `status` lines and add `statusLabel`:

```ts
export const BuildSchema = z.object({
  slug: z.enum(['fair-roads', 'severance', 'rollcall', 'knock-it-off']),
  title: z.string(),
  oneLine: z.string(),
  description: z.string(),
  dates: z.string(),
  liveUrl: z.string().url(),
  liveLabel: z.string(),
  status: z.enum(['live', 'kids', 'wip']),
  statusLabel: z.string().optional(),
  screenshot: z.string(),
  gradientHeader: z.string(),
});
```

`statusLabel` is optional because the three existing builds have none and must keep their default pill text.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- content.test`
Expected: PASS for the two new tests. The existing `builds match schema` test still passes — widening an enum breaks nothing.

- [ ] **Step 5: Commit**

```bash
git add src/content/schema.ts src/content/__tests__/content.test.ts
git commit -m "feat(schema): allow the fair-roads build and a custom status label"
```

---

## Task 2: Add the build entry, first in the array

**Files:**
- Modify: `src/content/builds.ts:6` (insert before the `severance` entry)
- Modify: `src/content/__tests__/content.test.ts:15-20`

- [ ] **Step 1: Update the failing assertions**

In `src/content/__tests__/content.test.ts`, replace the body of the `builds match schema` test:

```ts
  it('builds match schema', () => {
    expect(() => z.array(BuildSchema).parse(builds)).not.toThrow();
    expect(builds.length).toBe(4);
    const slugs = builds.map(b => b.slug);
    expect(slugs).toEqual(['fair-roads', 'severance', 'rollcall', 'knock-it-off']);
  });
```

The slug order is the display order — `BuildsSection` maps the array directly, so this assertion is what pins `fair-roads` to first position (spec §8).

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL — `expected 3 to be 4`

- [ ] **Step 3: Add the entry as the first element**

In `src/content/builds.ts`, insert as the first element of the `builds` array, before `severance`:

```ts
  {
    slug: 'fair-roads',
    title: 'fair-roads',
    oneLine: 'A road-mapping model for humanitarian volunteers — and what its own numbers said to build next.',
    description: 'Volunteers map roads by hand where no usable map exists. This model does the first pass, and the interesting part is what measuring it honestly changed.',
    dates: '2026 → ongoing',
    liveUrl: 'https://huggingface.co/tarabird90/dinov2s-roads',
    liveLabel: 'Model card ↗',
    status: 'wip',
    statusLabel: 'OPEN WEIGHTS',
    screenshot: '/screenshots/fair-roads-hero.png',
    gradientHeader: 'linear-gradient(135deg, #2a1810 0%, #5c3420 100%)',
  },
```

`oneLine` carries more weight than any other copy on the site now that this is the first card (spec §8) — it states what the thing is and who it is for, with no metric and no acronym. `liveUrl` will not resolve while the model card is private; that is expected (spec §7), do not change it.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add src/content/builds.ts src/content/__tests__/content.test.ts
git commit -m "feat(builds): add fair-roads as the first build"
```

---

## Task 3: Plumb the custom status label

`BuildCard.astro:16` and `CaseStudy.astro:53` both render `<StatusPill variant={...} />` with no label, so `OPEN WEIGHTS` cannot reach either without this task. `StatusPill` would otherwise print its `wip` default, `WIP`, which spec §8 rejects.

**Files:**
- Modify: `src/components/BuildCard.astro:16`
- Modify: `src/layouts/CaseStudy.astro:13-34, 53`

- [ ] **Step 1: Pass the label on the homepage card**

In `src/components/BuildCard.astro`, replace line 16:

```astro
      <StatusPill variant={build.status} label={build.statusLabel} />
```

`StatusPill` already declares `label?: string` and falls back to its per-variant default when the prop is `undefined`, so the three existing builds are unaffected.

- [ ] **Step 2: Widen the layout Props and pass the label**

In `src/layouts/CaseStudy.astro`, both Props interfaces declare `status: string` — no widening is needed for the type, but the frontmatter destructure must pick up the new field. Replace line 34:

```astro
const { title, eyebrow, description, liveUrl, liveLabel, status, statusLabel, gradientHeader, heroImage, stats = [] } = fm;
```

Add `statusLabel?: string;` beside `status` in **both** interface blocks (around lines 13-18 and 24-29), then replace line 53:

```astro
            <StatusPill variant={status} label={statusLabel} />
```

- [ ] **Step 3: Verify nothing broke**

Run: `npm run build`
Expected: build succeeds. Then: `npx astro check`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/BuildCard.astro src/layouts/CaseStudy.astro
git commit -m "feat(builds): let a build override its status pill label"
```

---

## Task 4: Fix the grid for four cards

`BuildsSection.astro:18` is `grid grid-cols-1 md:grid-cols-3`. A fourth build renders three cards and a lone orphan on the second row.

**Files:**
- Modify: `src/components/BuildsSection.astro:18`

- [ ] **Step 1: Change the grid**

Replace line 18:

```astro
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
```

Two columns gives a 2×2. Four-across at `max-w-6xl` (1152px) leaves each card about 265px wide, which is too narrow for a 180px-tall image header plus a title, a description and two buttons.

- [ ] **Step 2: Verify visually**

Run: `npm run dev`, open `http://localhost:4321`, scroll to the builds section.
Expected: a 2×2 grid, `fair-roads` top-left. Cards are wider than before — confirm the image headers still crop sensibly and no title wraps awkwardly.

Then narrow the window below `md` (768px) and confirm it collapses to one column.

- [ ] **Step 3: Commit**

```bash
git add src/components/BuildsSection.astro
git commit -m "fix(builds): 2x2 grid now that there are four builds"
```

---

## Task 5: Write the case study page

**Files:**
- Create: `src/pages/builds/fair-roads.mdx`

Read spec §5 first. The register is a hard requirement: **plain English, no metric names, no notation, seven numbers total.** Banned from this page: `IoU`, `clDice`, `APLS`, `macro-F1`, `ONNX`, `opset`, `sha256`, `logit`, `softmax`, `argmax`, `epoch`, `seed`, `checkpoint`, `chip`, `distroless`, `UPerNet`, `ViT-S/14`, and bare decimals presented without a unit or comparison.

- [ ] **Step 1: Create the file with frontmatter and body**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: fair-roads
eyebrow: "2026 → ONGOING · OPEN-SOURCE ML"
description: "A road-mapping model for humanitarian volunteers, and what measuring it honestly changed about what I built next."
liveUrl: "https://huggingface.co/tarabird90/dinov2s-roads"
liveLabel: "Model card ↗"
status: "wip"
statusLabel: "OPEN WEIGHTS"
gradientHeader: "linear-gradient(135deg, #2a1810 0%, #5c3420 100%)"
heroImage: "/screenshots/fair-roads-hero.png"
stats:
  - label: "MODEL AT"
    value: "huggingface.co/tarabird90/dinov2s-roads"
  - label: "BUILT WITH"
    value: "Vision transformer + segmentation head"
  - label: "ROLE"
    value: "Sole engineer"
  - label: "STATUS"
    value: "Open weights · 2026 → ongoing"
---

## Why anyone needs this

Large parts of the world have no usable map. That tends to correlate with exactly the places where a map matters most — disaster response, public health outreach, getting aid down a road that may or may not exist.

Volunteers at the Humanitarian OpenStreetMap Team fill those gaps by tracing roads by hand from satellite imagery. It works, and it is enormously slow.

HOT's answer is a platform called fAIr. Their own description of it is the part worth reading twice: it's meant to be the connective tissue between people who build geospatial ML models and the mapping communities who need them — *"without requiring users to be AI/ML engineers."* The gap it exists to close is that models get built in labs and research groups, while the communities mapping their own neighbourhoods have no practical way to use them. And without those communities' feedback, the models never improve in the places they're most needed.

## What it does, and what "good" means here

Give this model a satellite tile and it draws the roads it finds, labelling each one paved or unpaved. A person still checks and corrects the result. The job is turning a blank map into a draft.

But the thing that decides whether it's useful isn't its score on my test data. **fAIr models are base models — starting points that a mapping community fine-tunes on their own imagery, of their own region.** A model that scores well on four cities in a benchmark and adapts badly to a town in Nepal is worse, for this platform, than one that starts lower and improves quickly on local data.

That is why a later section about two towns — Banepa and Nhamatanda — matters more than the headline numbers. Fine-tuning onto somewhere new isn't a side experiment here. It's the entire use case.

Under the hood it's a vision transformer Meta released, with a segmentation head I trained on satellite road labels. The model card has the specifics.

One thing it's supposed to do and can't: spot footpaths. That turned out to be a property of the training data rather than a bug, and it gets its own section below.

## What got built

- The model, and the pipeline that trains it
- A test suite — **1,189 tests**
- A packaged version that runs on an ordinary server with no graphics card
- The integration work to make it plug into HOT's own platform
- A pipeline that pulled and prepared twenty thousand satellite tiles across five regions

## Two ways of scoring, and they disagreed

I retrained the model on four cities instead of one, and measured what changed. Two different ways of scoring gave two different answers.

The first counts how much of the road surface the model got right, pixel by pixel. By that measure, almost nothing changed.

The second asks a different question: do the roads it draws actually join up into a network you could trace a route across? By that measure it improved by about **38%**.

That gap is the interesting part, and it matters for a practical reason. A mapper doesn't need pixels — they need roads that connect. A map that is mostly accurate but broken into disconnected fragments is far less useful than the first score makes it sound, and the first score cannot see the difference.

Four things keep that 38% in proportion. It's measured against one organisation's hand-drawn maps, so it's agreement with those maps, not correctness. It covers four areas of the city, because a fifth had no roads in it to check against. **And it's still roughly half the score the hand-drawn map itself gets through the same machinery** — better connected, nowhere near solved. The next section explains where that comparison comes from.

The fourth is that I can't tell you why it improved. The new model also trained for longer, so "more cities" and "more training" are tangled together and this experiment can't separate them. It ran once, and nobody has measured how much these scores bounce between identical runs, so some of that 38% could be luck. The repeat runs that would have settled it were started and stopped before they finished.

So: two honest measurements disagreed, and one reading is that the simpler score was blind to something that matters. The useful part isn't that I know which — it's that the disagreement got chased instead of rounded off in the flattering direction.

## Checking the ruler before blaming the model

The connectivity score came out low, and I didn't know whether that meant the model was bad or the scoring was.

The tempting response is to adjust settings until the number improves. I tried **53** combinations, on the earlier single-city version of the model. The best of them barely moved it.

So I checked the ruler instead. I took the reference map — the one drawn by hand, the thing the model is being compared against — and fed it through the same scoring machinery, as if a model had produced it. It scored about **0.79 out of a possible 1.0**.

That settled it. A good answer does score well, so the scoring works. The model was genuinely the weaker part, and specifically because its roads came out in disconnected pieces. It also gives a real yardstick: the map scores 0.79, the model about half that. Not a number I picked — a number I measured.

That told me where the next month should go: connecting roads, not tuning settings.

Two things worth keeping honest. The settings were chosen using the same data they were then scored against, so even the best figure flatters itself. And the setting I picked made the *worst* area worse than the starting point did, because the selection rule chased the average and the weakest case paid for it.

## Grading against a category that couldn't exist

The model has three labels for road surface, and one of them — footpath — it can never produce.

That's a property of the training data. I checked every road in the dataset: **56,251** of them, and none of its road types is a footpath. It's a dataset of vehicle roads.

So the model was being graded on a category that could not appear, which quietly capped its best possible surface score at two-thirds no matter how well it did. I switched that label off, and changed the scoring so it names the categories it has no evidence for instead of averaging in zeros.

I had also reported a footpath accuracy figure earlier. When I went to reproduce it, it came out at zero, and I withdrew it before the proposal went out. It had only ever existed in prose — never written to a saved measurement — which is exactly why it survived as long as it did.

## Spending the evidence

This is the test that actually matters, for the reason at the top: a base model earns its place by how well it adapts to somewhere new, not by its score on the cities it trained on.

So I fine-tuned it onto **two** towns it had never seen — Banepa in Nepal and Nhamatanda in Mozambique, real imagery against community-drawn maps, nothing like the benchmark cities — with the rules for what would count as an improvement written down before I looked. The fine-tuned version did better on both, and cleared the bar I'd set in advance. That is the platform's use case, working.

Then I used those results to decide which version to ship. That decision spent them. Once you've chosen something because of how it scored on a test, that test isn't an independent check on it any more — it's part of how the thing was built. So I wrote that into the project's own records:

> Outcome inspected, so this region is development data. It cannot serve as confirmation for any Stage B claim […]

Two towns, permanently retired as evidence, written down voluntarily.

The same record notes that the reference maps those towns were scored against are raw community-contributed data, never hand-checked — so agreement with them is agreement, not correctness.

Nothing forces this bookkeeping. It only ever costs you something. It's also the difference between a number you can rely on and a number that merely sounds good.

## How this was actually built

I didn't write most of this code by hand. I directed AI agents to write it, and spent my own time on the part that needed me: deciding what to build, and building the checks that catch the agents when they're wrong.

That second part is most of the engineering.

- The footpath figure above existed only in prose and a commit message. It had never been written to a saved measurement. The checks are what caught that it didn't reproduce.
- Every figure in the grant proposal was audited against saved measurements before it went out, and the ones with no saved record were cut — including a results table I'd have been glad to publish.
- Every significant document went to reviewers running on different models from the one that wrote it, read-only, so they couldn't quietly fix what they found.

One of those reviews checked a revision rather than an original, and found **seven** new mistakes the rewrite itself had introduced. That's the number I'd point at. Rewriting introduces errors at about the same rate as writing, and the only reason I can tell you that is that I measured it.

## Where it stands

As of 22 September 2026:

- The four-city model is released with open weights.
- The figures come from data that also chose the model, so they are not an independent test.
- The repeat runs that would put error bars on the connectivity result were started and stopped.
- The fine-tuned versions were evaluated, but on towns now retired as evidence.
- A proposal went to HOT's public open call on 22 September 2026. No response yet.
- Nothing here is a claim to be state of the art.

### What happens if it's accepted

The call runs as a grant. Acceptance means a grant agreement, and only then does the real integration work start: a pull request into HOT's own model repository, reviewed by their team. The grant is released when that PR is merged — not when the proposal is accepted. Their current funding runs to the end of December, so the work has a deadline attached to it.

Merging is the point. A model sitting on a download page is a research artifact; a model merged into fAIr is one a mapping community can pick up, fine-tune on their own imagery, and use to draft roads in their own region without needing anyone on their team to understand machine learning.

That's the outcome worth wanting here, and it's still ahead of me.

### What I'd do differently

I built a rule-based system to detect when the satellite imagery and the map were misaligned. It accepted 2 tiles out of 200 — and when I looked at those two, both were wrong. The maps had been traced from the same imagery, so they were already aligned.

Writing the rules down in advance was right. The thing I wrote rules for didn't need solving. Look at the pictures before building the machinery.
```

- [ ] **Step 2: Check the register and the numbers budget**

Run:

```bash
grep -oniE "\b(IoU|clDice|APLS|macro-F1|ONNX|opset|sha256|logit|softmax|argmax|epoch|seed|checkpoint|distroless|UPerNet|ViT-S)\b" src/pages/builds/fair-roads.mdx
```

Expected: no output. (`Stage B` appears once, inside the quoted register entry — that is a verbatim quotation and is allowed; do not paraphrase it.)

Then count the numbers, using the budget's actual unit: **quantified claims about the model's performance or the project's scale.** Expected exactly these seven:

`1,189` tests · `38%` better connected · `53` combinations · `0.79` out of 1.0 · `56,251` roads · `two` towns retired · `seven` mistakes found

That is the ceiling from spec §8. Nothing may be added without removing one; if forced, drop `53`.

**Not counted, and not violations** — these are part of describing the thing, not claims about how well it works, and deleting them would break sentences rather than remove claims: "three road surfaces / only two produced" (that *is* the footpath finding), "four cities instead of one", "twenty thousand tiles across five regions", "two-thirds", "zero", the dates, and "2 tiles out of 200" in the closing anecdote. An earlier draft of the spec counted these and concluded the page was fifteen numbers over budget; it was measuring the wrong thing.

- [ ] **Step 3: Build and view**

Run: `npm run build && npm run preview`
Open `http://localhost:4321/builds/fair-roads`.
Expected: page renders, stats strip shows four rows, pill reads `OPEN WEIGHTS`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/builds/fair-roads.mdx
git commit -m "feat(builds): fair-roads case study"
```

---

## Task 6: Verify the whole change

- [ ] **Step 1: Confirm the asset exists**

Run: `ls -la public/screenshots/fair-roads-hero.png`
Expected: the file exists. **If it does not, stop here** — see Prerequisite. Do not ship a broken image on the first card.

- [ ] **Step 2: Full test and build**

Run: `npm test && npm run build && npx astro check`
Expected: all tests pass, build succeeds, no new type errors.

- [ ] **Step 3: Check the page against the spec's do-not-quote list**

Read spec §10. Confirm the page contains none of: the four-city per-city figures, `Stage A` unqualified, `+0.014` framed as an improvement, "nearly doubles", any comparison to HOT's own models, `0.4276`, any claim of HOT acceptance or partnership, any state-of-the-art claim, the private repo URL.

Run:

```bash
grep -niE "nearly doubl|state of the art|0\.4276|partner|accepted" src/pages/builds/fair-roads.mdx
```

Expected: no output.

- [ ] **Step 4: Visual pass**

Run: `npm run preview`, open `http://localhost:4321`.
Expected: builds grid is 2×2 with `fair-roads` first; its card shows the `OPEN WEIGHTS` pill; "Case study →" reaches the new page; "Model card ↗" points at `huggingface.co/tarabird90/dinov2s-roads` (it will not resolve while the card is private — expected).

- [ ] **Step 5: Re-measure Lighthouse**

Run: `npm run preview`, then Lighthouse against `http://localhost:4321`.
Record the four scores in `README.md`'s table, replacing the 2026-05-14 row and dating it. Do not assume 99/95/100/100 still holds — this change adds a fourth card with a fourth image.

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: re-measure Lighthouse after adding the fair-roads build"
```
