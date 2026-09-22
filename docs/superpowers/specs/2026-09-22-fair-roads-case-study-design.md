# fair-roads case study — design

Date: 2026-09-22
Status: design revised after two independent reviews (Sonnet on facts,
Fable on framing) and after the four-city Stage A run completed.
Target: a new case study at `/builds/fair-roads` on tarabird.com.

## Why this page exists

fair-roads is an open-source multi-class road-extraction model built for
HOT's fAIr platform. A grant proposal for it was sent to HOT on
2026-09-18 and has not been accepted; the source repository is private
until PR time.

The three existing case studies are indie-product shaped. They establish
that Tara ships products. None establishes that she does serious ML
engineering, which is the read that matters for a Director of AI
Engineering track.

This page's job is that second thing.

## The framing decision, and why it changed

The first draft of this spec was **rigor-led**: the body was about how
you know an ML number is real. An independent review argued that this is
half-wrong, and the argument holds:

> Rigor at Director level is table stakes, not a differentiator; the
> differentiator is judgement that changes what gets built next. Three of
> the four rigor beats are confessions, not decisions. A skimmer reads
> 0.63, a missed bar, a withdrawn figure and collapsed transfer, and
> takes away "a model that did not work, narrated carefully."

Two things follow, and the completed four-city run makes both easy.

**The thesis moves from "how I checked the numbers" to "what the numbers
told me to do."** Pre-registration and disclosure stay, but as the
mechanism behind decisions, not as the subject.

**The page must carry the positive material it was throwing away**: the
four-city result, and the system engineering (950 tests, ONNX export with
verified parity, distroless serving image, fAIr harness conformance, a
20k-chip OpenAerialMap pipeline across five regions).

Rejected alternatives, unchanged: product-shaped (hides the best
material, and the headline numbers are modest in isolation), and a dated
working log (reads as a changelog, needs upkeep).

## Publication posture

Approved: **publish now, frame the project rather than the
relationship.**

- fAIr is the target platform; it is a public open call, so saying so is
  factual.
- State plainly that a proposal is in and the work is mid-flight.
- **Do not imply acceptance, partnership, or any existing relationship
  with HOT.**
- Keep "HOT" out of the stats strip. A nonprofit's name in a stats bar on
  a personal portfolio page, before any relationship exists, reads
  differently from a body-text sentence about an open call.
- Link the public HuggingFace model card, not the private source repo.

## Prerequisites, now satisfied

**The model card was private and empty.** At first-draft time
`huggingface.co/tarabird90/dinov2s-roads` returned 401 and held only
`.gitattributes`, `LICENSE` and a pre-release `README.md` with no
weights and no results — while being the answer to *"Link to the model
repository"* in the proposal already sent to HOT.

**The release has since been cut twice**, both verified:

1. Khartoum-only Stage A published 2026-09-22 (superseded).
2. **Four-city Stage A**, the current release: checkpoint sha256
   `63dd20c7…` (99,407,751 B), ONNX sha256 `9d844d88…` (99,679,000 B).
   Slimmed from the 181.6 MB training checkpoint, verified tensor- and
   output-identical. ONNX exported at opset 17 through the repo's own
   `export_to_onnx_bytes`; parity against the PyTorch model measured at
   **5.2e-05** worst case across the three live channels, with the
   footpath channel a constant −1e4 in both. Published files downloaded
   anonymously and hashed to confirm they match byte-for-byte.

`liveUrl` is `https://huggingface.co/tarabird90/dinov2s-roads`, label
`Model card ↗`.

## The result the page is now built around

The four-city Stage A run completed 2026-09-22, 2.8 hours on one RTX
4090, code at `9ae5385`, clean tree.

| Region | Road IoU | clDice | Val chips |
|---|---|---|---|
| Las Vegas | 0.8753 | 0.9556 | 292 |
| Paris | 0.6815 | 0.7474 | 709 |
| Shanghai | 0.6556 | 0.7456 | 1,010 |
| Khartoum | 0.6430 | 0.6776 | 388 |
| Pooled | 0.6867 | 0.7607 | 2,399 |

**Two caveats the page must carry, because they are the point.**

*The Khartoum delta is inside the noise floor.* 0.6291 → 0.6430 is
+0.0139 against a ~0.02 run-to-run noise estimate. The honest claim is
that Khartoum is **unchanged**, not improved. Claiming the +0.014 would
be exactly the error this project exists to avoid — and the noise
estimate is itself weak (two pre-mitigation runs, not a matched seed
pair), which argues for more caution, not less.

*Held-out evidence was lost.* The superseded Khartoum-only checkpoint had
never seen Vegas, Paris or Shanghai and scored 0.585 / 0.386 / 0.399 on
them zero-shot. That was the project's only real generalisation evidence.
The four-city model trains on all four, so `held_out_sources: []` — it
has **no held-out evidence at all**. Paris at 0.6815 is not a
generalisation result and must never be set against the 0.386 as though
it were an improvement.

The defensible claim: the model covers four cities at 0.64–0.88 while
giving up nothing measurable on the first one. Capacity was not the
binding constraint. That is a decision-shaped result, and it is the arc
the page now follows.

## Where it lives, and the changes it needs

A fourth build at `/builds/fair-roads`, reusing `CaseStudy.astro`.

| File | Change |
|---|---|
| `src/content/schema.ts` | add `'fair-roads'` to `slug`; add `'wip'` to `status` |
| `src/content/builds.ts` | new entry — needs `oneLine`, `dates`, `screenshot`, `gradientHeader` as well as the page frontmatter fields |
| `src/pages/builds/fair-roads.mdx` | the page |
| `src/content/__tests__/content.test.ts` | `builds.length` 3 → 4; update the hardcoded slug array |
| `src/layouts/CaseStudy.astro` | one-line Props widening: `status: 'live' \| 'kids'` → add `'wip'`, or `astro check` may flag it |
| `public/screenshots/` | two new PNGs (see Assets) |

`StatusPill` already ships a `wip` variant, so no component change is
needed — but **use a custom label**: `status="wip" label="STAGE A
RELEASED"`. "WIP" next to three `LIVE` pills reads as a disclaimer;
"Stage A released" is equally true and reads as a milestone.

### Homepage card copy

Most readers form their impression here, so it is specified rather than
left to the implementer:

- `oneLine`: "Road extraction for humanitarian mapping — four cities, open weights."
- `dates`: "2026 → ongoing"

### Ordering

Place it **first**, but only if the stats strip and the first heading
read as competence without the surrounding paragraphs. If the
implementation lands and they do not, place it second and let Layoff
Calculator keep the lead.

### Frontmatter

```yaml
layout: ../../layouts/CaseStudy.astro
title: fair-roads
eyebrow: "2026 → ONGOING · OPEN-SOURCE ML"
description: "Open-weight road extraction for humanitarian mapping, across four cities — and what the measurements said to build next."
liveUrl: "https://huggingface.co/tarabird90/dinov2s-roads"
liveLabel: "Model card ↗"
status: "wip"
gradientHeader: "linear-gradient(135deg, #2a1810 0%, #5c3420 100%)"
heroImage: "/screenshots/fair-roads-hero.png"
```

Note the description no longer advertises epistemics ("how I checked
whether its numbers were real"), which was the self-defeating posture the
Voice section warns against.

### Stats strip

Carries achievement, not category labels:

| Label | Value |
|---|---|
| ROAD IoU | 0.687 across 4 cities |
| MODEL | DINOv2 ViT-S/14 + UPerNet · ONNX |
| ENGINEERING | 950 tests · distroless serve |
| ROLE | Sole engineer, agent-directed |

A pooled figure across four cities is not a decontextualised number the
way a bare `0.63` would be — the context is in the label.

## Sections

Seven, rebalanced: two carry positive results, two carry diagnosis, one
carries method, one carries status. Only §5 is a disclosure, and it is
really a structural finding.

Headings state conclusions, not questions.

### 1. What it does

Segmentation mask → skeleton → simplified LineStrings in RFC 7946
GeoJSON, with a surface label per segment. HOT volunteers trace roads by
hand in under-mapped regions; fAIr serves model assistance to them.

**Footpath honesty belongs here, not only in §5.** §1 must not promise
three classes the model cannot emit. Say: paved or unpaved track, with
footpath a declared class that has no supervision yet and is masked until
Stage B. Otherwise the page contradicts itself within two screens — the
same walk-back the proposal had to make.

### 2. What got built

Brief, plain numbers, no narrative: a `roads_hot` package under 950
passing tests; a four-stage distroless serving image; an ONNX export with
measured parity; conformance against fAIr's real harness (108 of 108 step
tests initially errored against the live harness and were fixed); a
20k-chip OpenAerialMap pipeline across five regions with pre-registered
held-out golden regions.

This section exists because the neighbouring case studies each show a
shipped thing, and without it this page reads weaker than the work is.

### 3. Four cities, and what the numbers actually said

The result table above. Then the two caveats — the Khartoum delta sitting
inside the noise floor, and the loss of held-out evidence — stated as
what they are: the reason the claim is "covers four cities without
regressing the first," not "improved Khartoum."

This is the page's demonstration that a number gets interpreted against
its own uncertainty before it gets believed.

### 4. The model, not the ruler

The centerpiece. Block APLS came in at 0.3006 length-weighted against a
**0.60 bar written down before the run**. The tempting move is to sweep
post-processing knobs until it passes: 53 configurations were swept,
spanning 0.172–0.3006.

Instead, push the **ground truth** through the identical post-processing
and scorer as though it were a prediction. It scores 0.7929
length-weighted (0.8274 mean, per-block range 0.743–0.875).

So the pipeline clears the bar and the model does not. The shortfall is
connectivity — pixel-accurate roads fragmenting into a broken graph — not
the measurement. That is a diagnosis that redirects the work: the next
gains are in topology, not post-processing tuning.

Two honesty notes that belong in the body: the shipped knobs were tuned
on the same validation blocks they are scored on, so even 0.3006 is
optimistic; and the chosen setting's **worst** block is worse than the
base point's (0.083 vs 0.110), because the selection rule maximised the
weighted mean and the weakest block paid for it.

The pre-registered bar appears here as setup, not as its own section.

### 5. The class that couldn't exist

SpaceNet 3's schema carries no footpath code — verified across all 56,251
features in all four AOIs. The channel was never supervised, so the mask
lives in the head rather than only in the loss, and inference and the
ONNX export are structurally unable to emit it (verified: the published
ONNX returns a constant −1e4 on that channel).

Two consequences, compressed to a few sentences each rather than given
their own sections:

- Three-class surface macro-F1 was silently capped at 0.667 by a class
  that could never appear. Evaluation now names the classes lacking
  evidence alongside a present-classes score.
- A previously reported 61.2% footpath-argmax figure did not reproduce
  (0.00% on re-measurement) and was withdrawn from the proposal before it
  was sent.

### 6. How this was actually built

**Flagged for Tara's veto — this is a positioning call, included on my
recommendation but easy to cut.**

The work is agent-directed, and the repository makes that discoverable
anyway. For a Director of AI Engineering track, directing agents and
building the verification that catches their errors is the most relevant
thing on the page. The withdrawn 61.2% figure is the proof: it existed
only in prose and a commit message, never in a committed measurement
artifact, and the verification gates are what surfaced that.

One honest paragraph. The risk of omitting it is a less impressive true
answer when someone asks how the work was done.

### 7. Where it stands, and what I'd do differently

Status, with an explicit **"as of 2026-09-22"** line: four-city Stage A
released with open weights; Khartoum metrics are validation metrics from
blocks that also chose the checkpoint; block APLS not yet re-measured on
this checkpoint; Stage B not run; a proposal is in to an open call and
has not been accepted; no state-of-the-art claim.

Then the alignment calibration: pre-registered rules accepted 2 of 200
tiles and inspection showed both accepted fits were wrong, because HOT
mappers had traced the OSM from the same imagery and it was already
aligned to within a few metres. Look at the overlays before building the
rule chain. The pre-registration was right; the thing pre-registered was
unnecessary.

## Assets

Both existing overlays are matplotlib figures with axes, tick labels and
raw filenames in their titles. Two clean PNGs, rendered by a script in
the fair-roads repo so they are reproducible:

1. `fair-roads-hero.png` — from `reports/khartoum_stage_a_release/e2e_predict_overlay.png`.
2. `fair-roads-pred-vs-gt.png` — from `reports/first_prediction/overlay.png`, predicted (9 features) vs ground truth (11).

**Both source figures were produced by the superseded Khartoum-only
checkpoint.** Either state that in the body, or regenerate them from the
four-city checkpoint. Regenerating is preferred; if it is not done, the
page must not imply the figures show the released model.

The hero tile may have been in the training split, so it is a sanity
check and not a performance number. The layout renders the hero at 25%
opacity with no caption slot, so no caption can mislead — but do not
describe it as performance in body text either.

Note this spans two repositories: assets are generated in `fair-roads`,
the page lives in `portfolio`.

## Do not quote

- **0.70 tile-level APLS** — predates a ground-truth converter fix; its
  own header says not to carry it forward.
- **`topo_like_f1`** — not the published metric; marked do-not-publish in
  `roads_hot/metrics/connectivity.py`.
- **61.2%** — except explicitly as the withdrawn figure in §5.
- **The private source repo URL.**
- **Any claim of HOT acceptance, partnership, or endorsement.**
- **Any state-of-the-art or benchmark claim.**
- **The +0.0139 Khartoum delta as an improvement** — it is inside the
  noise floor.
- **Paris 0.6815 set against Paris 0.386** as an improvement — different
  kinds of number.

**Corrected from the first draft:** "0.306 appears nowhere in the
repository" is now false. The knob sweep selected a setting scoring
0.3006 length-weighted, recorded in `sweep.json`, `stac-item.json` and
`pipeline.py`. The first draft also claimed "31 configurations, all
0.28–0.29" — stale mid-sweep data from `docs/2026-09-18-phase-5-status.md`.
The finished sweep is 53 settings spanning 0.172–0.3006. Both errors were
caught in review and are corrected above; the published model card was
corrected too.

## Voice

Match the existing case studies: first person, short declaratives, no
hype. Do not make the rigor sound heroic — overselling honesty is
self-defeating.

On emphasis: bold the results and the findings (the four-city coverage,
the 0.79–0.83 oracle ceiling, the 56,251-feature schema finding). Do not
bold the confessions. This is not the same as hiding them — the negatives
stay in plain text, in full, with their explanation in the same sentence.

## Implementation — two passes

**Pass A (fair-roads repo)** — land first:
- the asset-rendering script and the two PNGs, ideally regenerated from
  the four-city checkpoint
- confirm the proposal-sent evidence (see Open questions)

**Pass B (portfolio repo)**:
- schema, content, tests, layout Props widening, the page itself

## Verification

- `npm test` passes; `npm run build` succeeds; `astro check` clean
- every number on the page traces to a committed artifact, checked at
  implementation time against the source file
- no do-not-quote entry appears
- the page asserts no HOT relationship beyond "proposal submitted to an
  open call"
- §1 does not promise footpath output

## Review trigger

This page has dated, in-flight claims. Revisit it on any of: a HOT
decision, a Stage B result, a block-APLS measurement on the four-city
checkpoint, or the source repository going public.

## Open questions for Tara

1. **§6 (agent-directed disclosure)** — included on my recommendation;
   veto if you disagree.
2. **Proposal-sent evidence.** The only proposal in the repo
   (`docs/outreach/2026-09-18-hot-fair-proposal-draft.md`) is still
   headed "DRAFT. NOT SENT, and NOT SENDABLE AS IT STANDS" with an
   unresolved owner-decision block. You have said it was sent. The page
   will state publicly that a proposal is in, so the sent version and
   date should be recorded somewhere before publication.

## Out of scope

- Any change to the three existing case studies
- Updating the fair-roads README's stale "implementation not started"
  line, and the stale ONNX re-export caveat in
  `models/dinov2s_roads/README.md` (both fair-roads tasks; the latter is
  already queued)
- A `/writing` or long-form section
