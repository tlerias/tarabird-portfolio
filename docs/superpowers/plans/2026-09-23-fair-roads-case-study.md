# fair-roads Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth build, `fair-roads`, as the first card on the homepage builds grid and a full case study at `/builds/fair-roads`.

**Architecture:** Astro static site. Build data lives in a typed array (`src/content/builds.ts`) validated by Zod at test time; the homepage maps over it into `BuildCard`, and each build has an MDX page using the shared `CaseStudy` layout. This change adds one array entry, widens two Zod enums, adds one optional field, adjusts a grid, and writes one MDX page.

**Tech Stack:** Astro 6, MDX, Tailwind 4 (`@theme` tokens in `src/styles/tokens.css`), Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-22-fair-roads-case-study-design-v2.md`. Read §5 (page copy and register), §8 (ordering, stats strip, numbers budget) and §10 (do not quote) before starting. **Do not** implement `2026-09-22-fair-roads-case-study-design.md` on `main` — it is superseded and factually wrong.

**Land this plan before the homepage-skills plan.** It changes the build count that the other plan's lane 01 stat depends on.

---

## Assets — no longer blocking

Three images are committed and ready. They were cropped from matplotlib overlays Tara supplied (axes, tick labels and raw filenames removed), resized, and saved as JPEG rather than PNG because they are photographs:

| File | Size | Used by |
|---|---|---|
| `public/screenshots/fair-roads-fair-ui.jpg` | **not yet saved — see below** | homepage card `screenshot`, case-study `heroImage`, and the figure above the timeline |
| `public/screenshots/fair-roads-banepa.jpg` | 366 KB, 1100×958 | the figure in the fine-tuning stage |
| `public/screenshots/fair-roads-khartoum.jpg` | 284 KB, 1100×1093 | the figure in the one-city stage |
| `public/screenshots/fair-roads-hero.jpg` | 463 KB, 1400×1220 | superseded as hero by the fAIr screenshot; keep or delete |

**The fAIr screenshot is not on disk yet.** Tara has it; it needs saving to `public/screenshots/fair-roads-fair-ui.jpg`, cropped and compressed to match the others (~1400px wide, JPEG q82, under 500 KB). Until it exists, `BuildCard` renders a broken image on the first card — so this blocks Task 6 exactly as the earlier asset gap did.

**What that screenshot may and may not claim — read before writing any copy around it.** It was taken on a **local build of fAIr**, not HOT's hosted instance, running Tara's real model. It therefore shows that the model is discoverable and callable through fAIr's real interface. It does **not** show the model live on HOT's platform, and nothing on the page may imply that: the pull request has not been opened, and stages 11 and 12 of the timeline are still `ahead`. The caption states "a local build of the platform rather than HOT's hosted site" — do not trim that clause. It is the difference between an honest figure and a claim of a relationship that §7 and §10 forbid.

**Both overlays were produced by the superseded one-city model, not the four-city release.** Spec §9 forbids implying otherwise, and the captions in Task 5 handle it explicitly — each says "the one-city model". Do not reword them into "the model" or the page starts implying they show the released checkpoint.

**Known gap, not blocking.** The Banepa overlay is the model *zero-shot* on imagery it had never seen, which is genuinely what the fine-tuning stage needs to set up, but it is not the released model and it is not the fine-tuned result. If a render from the four-city checkpoint appears later, swap the files and keep the captions accurate to whatever is then shown.

**Colour legend deliberately unstated, and this is now a hard rule.** The two figures use **opposite** colour schemes, verified in the `fair-roads` session:

| | yellow | cyan/blue |
|---|---|---|
| Khartoum (A) | unpaved — 44 of 50 | paved — 6 of 50 |
| Banepa (B) | paved | unpaved (green = footpath) |

Figure A had no committed plotting script; its mapping was established empirically by sampling rendered pixel colours at each feature's real coordinates against the `surface` property in `e2e_predict.geojson`, with zero contradictions across all 50. Figure B's mapping is explicit in the script that drew it.

**So a single legend on this page would be backwards for one of the two figures.** Do not add one. The Khartoum caption states its unpaved count in words instead, which is the substantive point and carries no colour claim. If the figures are ever regenerated, render both with the same scheme first, and only then consider a legend.

**Attribution is required and is in the captions — do not trim it.** SpaceNet 3 (Khartoum) is CC BY-SA 4.0; OpenAerialMap (Banepa) is CC BY 4.0 and its metadata names Geomatics Engineering Society as the provider. Both are licence conditions, not niceties.

**Open licensing question for Tara, flagged not decided.** SpaceNet 3 is **ShareAlike**, and the Khartoum figure is a derivative of it. Whether ShareAlike has any implication for a figure on tarabird.com is a call for whoever handles the site's licensing. If the answer is awkward, the Banepa figure alone carries the page — it is CC BY, attribution only.

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
      dates: 'Sept 2026 · proposal submitted',
      liveUrl: 'https://huggingface.co/tarabird90/dinov2s-roads',
      liveLabel: 'Model card ↗',
      status: 'wip',
      statusLabel: 'PROPOSAL SUBMITTED',
      screenshot: '/screenshots/fair-roads-fair-ui.jpg',
      gradientHeader: 'linear-gradient(135deg, #0d2820 0%, #5b4380 100%)',
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
    dates: 'Sept 2026 · proposal submitted',
    liveUrl: 'https://huggingface.co/tarabird90/dinov2s-roads',
    liveLabel: 'Model card ↗',
    status: 'wip',
    statusLabel: 'PROPOSAL SUBMITTED',
    screenshot: '/screenshots/fair-roads-fair-ui.jpg',
    gradientHeader: 'linear-gradient(135deg, #0d2820 0%, #5b4380 100%)',
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

`BuildCard.astro:16` and `CaseStudy.astro:53` both render `<StatusPill variant={...} />` with no label, so `PROPOSAL SUBMITTED` cannot reach either without this task. `StatusPill` would otherwise print its `wip` default, `WIP`, which spec §8 rejects.

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

## Task 5b: Figure component

Two overlay images go on the page (Task 5). Both need a caption that says what they are — an uncaptioned aerial photo of road lines tells a reader nothing and invites them to assume it is a performance result.

**Files:**
- Create: `src/components/Figure.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props { src: string; alt: string; caption: string; }
const { src, alt, caption } = Astro.props;
---
<figure class="my-5">
  <img src={src} alt={alt} loading="lazy"
    class="w-full rounded-xl border border-card-border" />
  <figcaption class="font-mono text-[11px] leading-[1.5] text-ink/60 mt-2.5">
    {caption}
  </figcaption>
</figure>
```

Mono at 11px matches the site's existing caption register (`BuildCard`'s date line, `SectionHeader`'s kicker). `loading="lazy"` because both figures sit well below the fold.

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Figure.astro
git commit -m "feat(ui): captioned figure for case-study images"
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
eyebrow: "2026 · OPEN-SOURCE ML"
description: "A road-mapping model for humanitarian volunteers, and what measuring it honestly changed about what I built next."
liveUrl: "https://huggingface.co/tarabird90/dinov2s-roads"
liveLabel: "Model card ↗"
status: "wip"
statusLabel: "PROPOSAL SUBMITTED"
gradientHeader: "linear-gradient(135deg, #0d2820 0%, #5b4380 100%)"
heroImage: "/screenshots/fair-roads-fair-ui.jpg"
stats:
  - label: "MODEL AT"
    value: "huggingface.co/tarabird90/dinov2s-roads"
  - label: "BUILT WITH"
    value: "Vision transformer + segmentation head"
  - label: "ROLE"
    value: "Sole engineer"
  - label: "STATUS"
    value: "Model downloadable · proposal submitted"
---

import Figure from '../../components/Figure.astro';
import Timeline from '../../components/Timeline.astro';
import TimelineStage from '../../components/TimelineStage.astro';

## Why anyone needs this

Large parts of the world have no usable map. That tends to correlate with exactly the places where a map matters most — disaster response, public health outreach, getting aid down a road that may or may not exist.

Volunteers at the [Humanitarian OpenStreetMap Team](https://www.hotosm.org) fill those gaps by tracing roads by hand from satellite imagery. It works, and it is enormously slow.

HOT's answer is a platform called [fAIr](https://www.hotosm.org/en/tools-resources/tech-product-suite/fair/). Their own description is the part worth reading twice: it's meant to be the connective tissue between the people who build geospatial ML models and the mapping communities who need them — *"without requiring users to be AI/ML engineers."* Models get built in labs; the communities mapping their own neighbourhoods have no practical route to using them. And without those communities' feedback, the models never improve where they're most needed.

## What it has to be good at

Give this model a satellite tile and it draws the roads it finds, labelling each one paved or unpaved. A person still checks and corrects it. The job is turning a blank map into a draft.

It's a **base model** — a starting point that a mapping community fine-tunes on imagery of their own region. So the thing it has to be good at is *adapting*. A district in Nepal doesn't look like Las Vegas, and the model that helps there is the one that picks up local conventions quickly from a small amount of local data.

Which means the value gets created at a step I don't control, by someone I'll never meet. That shaped what I built and how I measured it.

Under the hood it's a vision transformer Meta released, with a segmentation head I trained on satellite road labels. The model card has the specifics.

<Figure
  src="/screenshots/fair-roads-fair-ui.jpg"
  alt="The fAIr mapping interface with Roads selected, a red box drawn over a hillside town, and predicted roads traced in purple across it"
  caption="What it looks like working: my model inside fAIr's own interface, running on a local build of the platform rather than HOT's hosted site. I drew the box; it found 52 road segments. Making this work for someone who isn't me is what the rest of this page is about."
/>

## The timeline

<Timeline>

<TimelineStage label="Asked before building" date="16 Sept 2026">
I sent HOT four questions before writing any code. Should a first model do multi-class surface types or plain binary road detection? Does their interface expect road lines or filled shapes? Two of the answers changed the design, and one of them — that they'd prefer multi-class but doubted there was enough training data — turned out to predict the exact wall I hit months later.
</TimelineStage>

<TimelineStage label="Built a base model on one city">
Khartoum first, from a public satellite road dataset. One city, so that everything after it had something to be compared against.

<Figure
  src="/screenshots/fair-roads-khartoum.jpg"
  alt="Satellite view of a Khartoum neighbourhood with the model's predicted roads drawn over it as coloured lines"
  caption="The one-city model over a Khartoum tile: 50 road segments across 25 image tiles, 44 of them unpaved track. This tile was part of what the model learned from, so it shows what it draws — not how it does somewhere new. Imagery: SpaceNet 3, CC BY-SA 4.0."
/>
</TimelineStage>

<TimelineStage label="Found a class that couldn't exist">
The model has three labels for road surface, and one of them — footpath — it can never produce.

That's a property of the training data. I checked every road in the dataset: **56,251** of them, and none of its road types is a footpath. It's a dataset of vehicle roads.

So the model was being graded on a category that could not appear, quietly capping its best possible surface score at two-thirds. I switched that label off and changed the scoring to name the categories it has no evidence for instead of averaging in zeros.

I'd also reported a footpath accuracy figure earlier. When I went to reproduce it, it came out at zero, and I withdrew it before the proposal went out. It had only ever existed in prose — never written to a saved measurement — which is exactly why it survived as long as it did.
</TimelineStage>

<TimelineStage label="Checked the ruler before blaming the model">
Roads are only useful if they join up. Alongside the obvious score — how much of the road surface the model got right, pixel by pixel — I tracked a second one: do the roads it draws form a network you could actually trace a route across?

On the one-city model that second score came out low, and I couldn't tell whether that meant the model was bad or the scoring was.

The tempting response is to adjust settings until the number improves. I tried **53** combinations of the settings that turn a prediction into road lines. The best of them barely moved it.

So I checked the ruler. I took the reference map — the one drawn by hand, the thing the model is compared against — and fed it through the same scoring machinery as if a model had produced it. It scored about **0.79 out of a possible 1.0**.

That settled it. A good answer does score well, so the scoring works. The model was genuinely the weaker part, and specifically because its roads came out in pieces. It also gave me a yardstick I hadn't had: 0.79 is what a near-perfect answer scores on this scale. Not a number I picked — a number I measured.

Two things worth keeping honest: the settings were chosen using the same data they were then scored against, so even the best figure flatters itself; and the setting I picked made the *worst* area worse, because the selection rule chased the average and the weakest case paid for it.
</TimelineStage>

<TimelineStage label="Retrained on four cities">
Four cities instead of one, same recipe. I kept the first city's test split frozen so that a before-and-after would actually mean something.
</TimelineStage>

<TimelineStage label="Two ways of scoring disagreed">
I scored the new model against the old one on that frozen test data. The two measures told different stories.

The pixel score barely moved. The connectivity score — the one I'd checked the ruler on — went up by about **38%**.

That gap is the interesting part. A mapper doesn't need pixels, they need roads that connect — and a map that's mostly accurate but broken into disconnected fragments is far less useful than the first score makes it sound.

Both scores come from four areas of the city — a fifth had no roads in it to score against — measured against one organisation's hand-drawn maps. So what they capture is agreement with those maps, not correctness, and it rests on four areas rather than a city.

Even after that jump it scores about half what the hand-drawn map does. Better connected, not well connected.

And I can't say *why* it improved. The four-city model also trained for longer, and it ran once with no noise floor measured — so more cities, more training and run-to-run variation are still tangled together.
</TimelineStage>

<TimelineStage label="Rehearsed the real use case">
This is the test that actually matters, for the reason at the top: a base model earns its place by how well it adapts somewhere new.

So I fine-tuned it onto **two** towns it had never seen — Banepa in Nepal and Nhamatanda in Mozambique, real imagery against community-drawn maps, nothing like the benchmark cities — with the rules for what would count as an improvement written down before I looked. It did better on both, and cleared the bar I'd set in advance.

<Figure
  src="/screenshots/fair-roads-banepa.jpg"
  alt="Drone view of Banepa, Nepal, a hillside town of dense rooftops and terraced fields, with the model's predicted roads drawn over it as coloured lines"
  caption="The same one-city model on Banepa, Nepal: drone imagery at roughly 3 cm per pixel that it had never seen, with no fine-tuning of any kind, finding 55 road segments. This is the starting point a mapping community would fine-tune from. Imagery: Geomatics Engineering Society via OpenAerialMap, CC BY 4.0."
/>

Then I used those results to decide which version to ship, and that decision spent them. Once you've chosen something because of how it scored on a test, that test isn't an independent check any more — it's part of how the thing was built. So I wrote that into the project's records:

> Outcome inspected, so this region is development data. It cannot serve as confirmation for any Stage B claim […]

Two towns, permanently retired as evidence, written down voluntarily. The same record notes those towns were scored against raw community-contributed maps, never hand-checked — so agreement with them is agreement, not correctness.

Nothing forces this bookkeeping. It only ever costs you something.
</TimelineStage>

<TimelineStage label="Published the model for anyone to download">
The model itself is published, not just an API you call: [the trained file is on HuggingFace](https://huggingface.co/tarabird90/dinov2s-roads) with the record of how it was measured beside it. Download it, run it, check the claims. The code that trained it stays private.

By this point the project was more than a model: a training pipeline, **1,189** tests, a packaged version that runs on an ordinary server with no graphics card, the work to make it plug into HOT's platform, and a pipeline that pulled and prepared twenty thousand satellite tiles across five regions. Every number in its documentation says what kind of number it is.
</TimelineStage>

<TimelineStage label="Proposal submitted" date="22 Sept 2026" status="now">
Sent to HOT's open call for geospatial models. No response yet.
</TimelineStage>

<TimelineStage label="Acceptance, and a grant agreement" status="ahead">
The call runs as a grant. Acceptance isn't a finish line — it's the document that lets the integration work start.
</TimelineStage>

<TimelineStage label="A pull request into HOT's model repository" status="ahead">
I hand over a description of the model and two container images: one that trains, one that serves predictions. A HOT admin reviews it. I never touch a server — my entire deliverable is a container that behaves correctly when somebody else runs it.
</TimelineStage>

<TimelineStage label="Merged, and the model goes live in fAIr" status="ahead">
Their system reads the description, mirrors the weights, and stands the serving image up as a live endpoint. The grant releases on merge, not on acceptance. A model on a download page is a research artifact; a model merged into fAIr is one people can actually reach.
</TimelineStage>

<TimelineStage label="Mappers fine-tune it for their own districts" status="ahead">
A mapper opens fAIr and, where today they can only choose Buildings, they can choose Roads. The generic model won't know their district's conventions — an unpaved track in rural Mozambique doesn't look like one outside Las Vegas — so they draw their area, and the platform pulls existing map data and imagery for it and fine-tunes my model into *their* model. They write no code and don't need to know what fine-tuning is.
</TimelineStage>

<TimelineStage label="Predictions become map data" status="ahead">
When a mapper trusts a prediction, they accept it and it goes into OpenStreetMap as a real edit. A road that wasn't on the map is now on the map, somewhere someone is trying to route aid down it.

This is the only step that counts. Everything above it is plumbing in service of it.
</TimelineStage>

</Timeline>

## How this was built

I direct AI agents to write the code. My own time goes to deciding what to build and to building the checks that catch the agents when they get it wrong, which is most of the engineering.

Some of what that looks like here:

- A figure has to exist as a saved measurement, not just in prose. The footpath number earlier failed that check and was withdrawn.
- Before the proposal went out, every figure in it was audited against those saved measurements. Anything without one was cut, including a results table I'd have been glad to publish.
- Documents go to reviewers running on different models from the one that wrote them, read-only, so a reviewer can't quietly fix what it finds.

One of those reviews looked at a revision rather than an original, and found **seven** new mistakes the rewrite had introduced. Revising turns out to be about as error-prone as writing, which isn't obvious until you count.

## What I'd do differently

I built a rule-based system to detect when the satellite imagery and the map were misaligned. It accepted 2 tiles out of 200 — and when I looked at those two, both were wrong. The maps had been traced from the same imagery, so they were already aligned.

Writing the rules down in advance was right. The thing I wrote rules for didn't need solving. Look at the pictures before building the machinery.
```

- [ ] **Step 2: Check the register and the numbers budget**

Run:

```bash
grep -oniE "\b(IoU|clDice|APLS|macro-F1|ONNX|opset|sha256|logit|softmax|argmax|epoch|seed|checkpoint|distroless|UPerNet|ViT-S)\b" src/pages/builds/fair-roads.mdx
```

Expected: no output. (`Stage B` appears once, inside the quoted register entry — that is a verbatim quotation and is allowed; do not paraphrase it.)

Then verify the timeline stages render in order with exactly one `status="now"`:

```bash
grep -c "TimelineStage" src/pages/builds/fair-roads.mdx   # expect 28 (14 open + 14 close)
grep -c 'status="now"' src/pages/builds/fair-roads.mdx    # expect 1
grep -c 'status="ahead"' src/pages/builds/fair-roads.mdx  # expect 5
```

Then count the numbers, using the budget's actual unit: **quantified claims about the model's performance or the project's scale.** Expected exactly these seven:

`1,189` tests · `38%` better connected · `53` combinations · `0.79` out of 1.0 · `56,251` roads · `two` towns retired · `seven` mistakes found

That is the ceiling from spec §8. Nothing may be added without removing one; if forced, drop `53`.

**Not counted, and not violations** — these are part of describing the thing, not claims about how well it works, and deleting them would break sentences rather than remove claims: "three road surfaces / only two produced" (that *is* the footpath finding), "four cities instead of one", "twenty thousand tiles across five regions", "two-thirds", "zero", the dates, and "2 tiles out of 200" in the closing anecdote. An earlier draft of the spec counted these and concluded the page was fifteen numbers over budget; it was measuring the wrong thing.

- [ ] **Step 3: Build and view**

Run: `npm run build && npm run preview`
Open `http://localhost:4321/builds/fair-roads`.
Expected: page renders, stats strip shows four rows, pill reads `PROPOSAL SUBMITTED`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/builds/fair-roads.mdx
git commit -m "feat(builds): fair-roads case study"
```

---

## Task 6: Verify the whole change

- [ ] **Step 1: Confirm the assets exist**

Run: `ls -la public/screenshots/fair-roads-*.jpg`
Expected: all three files present (banepa, khartoum, hero). They are committed already — see Assets.

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
Expected: builds grid is 2×2 with `fair-roads` first; its card shows the `PROPOSAL SUBMITTED` pill; "Case study →" reaches the new page; "Model card ↗" points at `huggingface.co/tarabird90/dinov2s-roads` (it will not resolve while the card is private — expected).

- [ ] **Step 5: Re-measure Lighthouse**

Run: `npm run preview`, then Lighthouse against `http://localhost:4321`.
Record the four scores in `README.md`'s table, replacing the 2026-05-14 row and dating it. Do not assume 99/95/100/100 still holds — this change adds a fourth card with a fourth image.

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: re-measure Lighthouse after adding the fair-roads build"
```

---

## Task 5a: Timeline components

Spec §5 restructures the page as a timeline with a "you are here" marker at **Proposal submitted**. Two small components, because the stage bodies are rich prose and belong in MDX rather than in a data array.

**Files:**
- Create: `src/components/Timeline.astro`
- Create: `src/components/TimelineStage.astro`

- [ ] **Step 1: Create the rail**

`src/components/Timeline.astro`:

```astro
---
---
<ol class="list-none p-0 m-0 mt-8 relative">
  <slot />
</ol>
```

- [ ] **Step 2: Create the stage**

`src/components/TimelineStage.astro`:

```astro
---
interface Props {
  label: string;
  date?: string;
  status?: 'done' | 'now' | 'ahead';
}
const { label, date, status = 'done' } = Astro.props;

const dot = {
  done:  'bg-mint border-mint',
  now:   'bg-lavender border-lavender ring-4 ring-lavender/25',
  ahead: 'bg-transparent border-card-border',
}[status];

const rail = status === 'ahead' ? 'border-dashed border-card-border' : 'border-solid border-mint/40';
const body = status === 'ahead' ? 'text-ink/55' : 'text-ink/85';
---
<li class={`relative pl-8 pb-8 border-l-2 last:border-l-0 last:pb-0 ${rail}`}>
  <span class={`absolute left-0 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 ${dot}`} aria-hidden="true"></span>

  <div class="flex items-baseline gap-3 flex-wrap">
    <h2 class="font-display font-bold text-[20px] m-0" style="letter-spacing:-0.025em">{label}</h2>
    {date && <span class="font-mono text-[10px] uppercase tracking-[1.5px] text-ink/50">{date}</span>}
    {status === 'now' && (
      <span class="font-mono text-[9px] font-bold uppercase tracking-[1.5px] bg-lavender text-cream rounded-full px-2.5 py-1">I am here</span>
    )}
  </div>

  <div class={`mt-2 text-[15px] leading-[1.6] ${body}`}>
    <slot />
  </div>
</li>
```

Three details:

1. **`<ol>`/`<li>`** — this is an ordered sequence and a screen reader should announce it as one. The dots are `aria-hidden`; status is conveyed by the visible "I am here" chip and by the prose, not by colour alone.
2. **`ahead` stages are dashed and dimmed**, not hidden. The point of the timeline is that the unfinished stages are visible.
3. **No `prefers-reduced-motion` concern** — nothing animates. Do not add a pulsing marker; the chip carries it.

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Timeline.astro src/components/TimelineStage.astro
git commit -m "feat(ui): timeline with a i-am-here marker"
```
