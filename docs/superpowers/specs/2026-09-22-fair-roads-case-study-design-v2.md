# fair-roads case study — design (v2)

**Date:** 2026-09-22
**Target:** a new case study at `/builds/fair-roads` on tarabird.com
**Supersedes:** `2026-09-22-fair-roads-case-study-design.md` (commits `3de681d`, `40515ea` on `main`). Do not implement that one.
**Status:** draft for Tara's approval. Not yet independently reviewed.

---

## 1. Why this replaces the existing spec

The spec on `main` was written from `fair-roads` at `9ae5385` (2026-09-19) while 31 commits of newer evidence existed on `claude/fair-roads-codex-review-dbddf1` (latest `c3fbf98`, 2026-09-22 16:52). Its factual core is wrong in ways that change what the page should say.

| The existing spec states | Actual |
|---|---|
| "Stage B not run" | Stage B fine-tuning ran. Two candidates completed and were scored. |
| "`held_out_sources: []` — it has **no held-out evidence at all**" | Held-out evaluation exists on two OpenAerialMap cities, against pre-registered gates. |
| "block APLS not yet re-measured on this checkpoint" | Measured 2026-09-22. Mean `0.2862 → 0.3945`, length-weighted `0.2866 → 0.3775`. |
| "§4: Block APLS came in at **0.3006** length-weighted" | That is a Khartoum-era, sweep-selected figure. |
| "a proposal … was sent to HOT on 2026-09-18" | It was not sent on that date; the covering email was still marked "Not sent" on 09-22 with open blockers. **Tara sent it on 2026-09-22.** |
| "a `roads_hot` package carrying 1,189 test functions across 82 files" | The count is correct; the scope label is not. 1,189/82 is the whole repository; `roads_hot` alone is 981/65. See §6. |
| The four-city per-city results table as "the result the page is now built around" | That table is **unpinned** and was cut from the proposal. See §4. |

The `9ae5385` pin is itself a trap: that commit is still `main`, so a reader checking "is this current?" against `main` gets a false yes.

## 2. What this page is for

`fair-roads` is the only thing in Tara's portfolio that demonstrates ML engineering. The three existing case studies are indie-product shaped and establish that she ships. This page establishes something different and harder to fake: that she can tell whether a number means anything.

Audience, in order: a hiring manager reading for a Director of AI Engineering track; a technical contracting client; an engineering peer.

**The thesis is not "I built a road model."** The model's headline numbers are modest in isolation and one of its two arms is inside the noise floor. The thesis is: *measurement discipline changed what got built, and the page can show exactly where.* That claim is unusual, defensible from committed artifacts, and the reason the page is worth publishing while the work is mid-flight.

## 3. Naming: the "Stage A" collision

**This is the single easiest way to make the page wrong, and the existing spec fell into it.**

The project uses "Stage A" in two incompatible senses:

1. **A training stage.** The HuggingFace card: *"Status: Stage A base model, trained on four SpaceNet 3 cities (Khartoum, Paris, Shanghai, Las Vegas)."* Here Stage A is base training, as opposed to Stage B fine-tuning, and the four-city model **is** Stage A.

   **Provenance — read this before trying to verify that quote.** It is not in git. It was read from the live public model card at `huggingface.co/tarabird90/dinov2s-roads` on 2026-09-22, before Tara made the card private later the same day. The committed copy at `models/dinov2s_roads/README.md` is **stale** — it still describes the superseded Khartoum-only release and never uses "Stage A" at all. Two independent reviewers have already searched git for this quote, failed to find it, and concluded it was fabricated or misattributed. It was neither, but the confusion is now on record twice, which means the page must not rest on it without re-confirmation when the card is republished (§13).
2. **A specific checkpoint.** `fourcity_apls_20260922/SUMMARY.json` and `candidate_comparison.json` both use `stage_a` as the name of the **superseded Khartoum-only checkpoint** (`3f143fc8…`), used as the control arm.

Both are in committed artifacts. Neither is wrong internally. Together they are a trap: "Stage A block APLS is 0.286" and "Stage A road IoU is 0.643" are both true statements about *different models*.

**Rule for this page: never write "Stage A" unqualified.** Use:

- **"the four-city model"** — the published checkpoint `63dd20c7…`
- **"the Khartoum-only model"** — the superseded checkpoint `3f143fc8…`
- **"base training" / "fine-tuning"** when the training *stage* is meant

Do not use `STAGE A RELEASED` as a status pill label, as the existing spec proposed. It names the model after its own control.

## 4. Evidence inventory — what may and may not be published

On 2026-09-22 the project audited every figure in its proposal against committed artifacts and **cut those with no evaluation record on disk**. Two independent checks agreed. That audit is binding on this page.

### Pinned — usable

| Figure | Value | Artifact |
|---|---|---|
| Khartoum road IoU, Khartoum-only → four-city | `0.6291 → 0.643` | `reports/fourcity_seeds_20260922/prospective_record.json` (frozen before any seed ran) |
| Block APLS, Khartoum-only → four-city (mean) | `0.2862 → 0.3945` | `reports/fourcity_apls_20260922/SUMMARY.json` |
| Block APLS, length-weighted | `0.2866 → 0.3775` | same |
| Reproduction control | archived run reproduced to `0.2862263598839334`, exact on all blocks | same |
| Zero-shot, Khartoum-only model | Vegas `0.585`, Paris `0.386`, Shanghai `0.399` | `reports/khartoum_stage_a_release/zero_shot.json` |
| Held-out OAM, base → fine-tuned | mean road IoU `0.2907 → 0.3628` (`+0.0721`) | `reports/publication_20260921/candidate_comparison.json` |
| Footpath schema finding | no footpath code across all `56,251` features in 4 AOIs | model card; verified |
### Pinned, but NOT verifiable from this repository

These two rows are real but their evidence lives only in the HuggingFace repo, **which is currently private**. Treat them as weaker than everything above.

| Figure | Value | Where it lives |
|---|---|---|
| Published artifact hashes | ckpt `63dd20c7…` (99,407,751 B), ONNX `9d844d88…` (99,679,000 B) | HF card Files table only |
| ONNX parity, four-city | `6.4e-05` worst case across three live channels | `onnx_parity.json`, **in the HF repo beside the weights — not in git** |

**Do not confuse these with `reports/publication_20260921/artifact_verification.json`.** That file describes the *superseded Khartoum-only* release — its own paths read `runs/khartoum_stageA_20260918T235031Z/release/` — and carries different values: ckpt `3f143fc8…`, ONNX `dbdc48fa…`, parity `5.15e-05` on the live channels. A reviewer checking this spec against that file will "find" three errors that are not errors; one already did. Same architecture means identical file sizes, which makes the two releases easy to mistake for each other.

**Provenance:** these values were read from the live public model card on 2026-09-22, before it was made private. They are not in git and cannot currently be re-checked by anyone.

**There is a real gap in the project here, not just in this spec.** The Khartoum-only release has a meticulous committed trail — `reports/khartoum_stage_a_release/` and `reports/publication_20260921/` with `artifact_verification.json`, hashes, parity, golden scores. **The four-city release has no equivalent.** There is no `publication_20260922/`. `git grep` finds zero hits for `63dd20c7`, `9d844d88` or `6.4e-05` anywhere in the tree. Worse, `models/dinov2s_roads/stac-item.json` carries `properties.updated: "2026-09-22T00:00:00Z"` and *still* names `dbdc48fa…` — the Khartoum-only file — as "the released ONNX".

So the repository's own same-day metadata disagrees with the model card about which checkpoint is published. The card is the better authority for what is actually on HuggingFace, but the disagreement is unresolved and it sits in the exact area this page claims competence in.

**Action, in order:**
1. **Tell Tara** (§12). The four-city release shipping without the verification trail its predecessor got is a process gap worth closing regardless of this page.
2. Copy `onnx_parity.json` into `reports/`, and update `stac-item.json` to name the four-city ONNX.
3. Until (2) is done, **drop the parity figure and the hashes from the page.** A page arguing that numbers must trace to artifacts cannot lead with two that do not. The page loses little — neither figure is part of its argument.

### Unpinned — must NOT appear

**The four-city per-city results table.** Paris, Shanghai, Las Vegas and the pooled row; every clDice value; the F1/precision/recall columns; all four validation chip counts. Per `docs/outreach/proposal-send-checklist.md`: *"none of which appear in any evaluation record on disk. Two independent checks found the same thing."*

This is the table the existing spec built its page around, and it was live on the HuggingFace card until Tara made the card private on 2026-09-22.

**Consequence for this page:** it cannot claim four-city coverage with per-city numbers. It can say the model was trained on four SpaceNet 3 cities — that is a fact about the training run, recorded in the run config — but the only per-city validation figure it may quote is Khartoum's `0.643`, because only Khartoum's was frozen in a pre-registered record.

If the four-city evaluation is ever re-run and committed, this section is the thing to revisit.

## 5. The arc

Seven sections. Two carry results, three carry method, one carries the finding the page exists for, one carries status.

### 1. What it does
Multi-class road extraction for HOT's fAIr platform: a 256×256 RGB chip in, road mask plus per-segment surface class out, post-processed to simplified LineStrings in RFC 7946 GeoJSON. HOT volunteers trace roads by hand in under-mapped regions; fAIr serves model assistance to them.

**Footpath honesty belongs here, not deferred.** The model declares three surface classes but can only emit two. Say so in this section or the page contradicts itself two screens later.

### 2. What got built
Plain inventory, no narrative: the `roads_hot` package and its test suite (§6 for how to count); a four-stage distroless serving image; ONNX export at opset 17 with measured parity; conformance work against fAIr's real harness; a 20k-chip OpenAerialMap pipeline across five regions.

This section exists because the neighbouring case studies each show a shipped thing. Without it this page reads weaker than the work is.

### 3. Two numbers that disagreed
**The centerpiece.** Adding three cities to base training moved Khartoum's pixel IoU from `0.6291` to `0.643` — **+0.014, inside the project's ~0.02 noise floor.** On the same checkpoints and the same frozen 388-chip validation split, block APLS moved from `0.2862` to `0.3945`.

The pixel metric said nothing happened. The connectivity metric said something substantial did. Both were measured correctly.

**State the disagreement as the observation, and the explanation as a hypothesis. Do not assert the causal mechanism.**

The tempting sentence — *"pixel IoU was not measuring the thing the product needs"* — is not earned by this experiment, and a reader in the target audience will see why before the caveat list does its work. Two alternatives are live and unexcluded:

1. **Training length.** The four-city model's best epoch was ~21 of 26; the Khartoum-only model's was 8 of 14. APLS rewards coherent long-range topology, which plausibly keeps improving after pixel IoU saturates. "Trained longer" explains the result as well as "saw more cities."
2. **Noise.** There is **no APLS noise floor at all.** The ~0.02 figure this page cites is a pixel-IoU estimate, and a weak one. A `+0.108` mean delta at n=1 per arm cannot be separated from run-to-run variation, because nobody has measured what that variation is.

So write it as: the two metrics disagreed on the same checkpoints and the same frozen split; one reading is that pixel IoU was insensitive to the topological property the product depends on; the experiment as run cannot distinguish that from a longer training schedule or from noise; the seed repeats that would separate them were launched and terminated before finishing.

That is a weaker claim and a better page. The section's value is that the disagreement was *noticed and interrogated* rather than resolved into whichever number flattered the work — not that the mechanism is known. Asserting the mechanism here is precisely the failure this page exists to demonstrate avoiding, committed on the page itself.

The honesty this section must carry, from the artifact's own `cannot_conclude` block:

- **single seed per arm, no noise floor** — the `+0.108` APLS delta may not exceed run-to-run variation, and the repeats that would establish it have not run
- **a confound** — the four-city model differs in training data *and* training length (best epoch ~21 of 26 vs 8 of 14); this experiment cannot separate "more cities" from "more training"
- ground truth is SpaceNet 3's own annotations, so this measures agreement, not accuracy
- 4 of 5 blocks scored; one has empty ground truth
- still far below the project's own pre-registered `0.60` connectivity target

State the `+0.014` as **unchanged**, never as an improvement.

### 4. The model, not the ruler
Block APLS missed a `0.60` bar written down before the run. The tempting move is to sweep post-processing until it passes; 53 configurations were swept, spanning `0.172–0.3006`.

Instead: push the **ground truth** through the identical post-processing and scorer, as though it were a prediction. It scores `0.7929` length-weighted. So the pipeline clears the bar and the model does not — the shortfall is connectivity, not the measurement. That redirects the work toward topology rather than knob-tuning.

Two honesty notes in the body: the shipped knobs were tuned on the same validation blocks they are scored on, so even `0.3006` is optimistic; and the chosen setting's *worst* block is worse than the base point's (`0.083` vs `0.110`), because the selection rule maximised the weighted mean and the weakest block paid.

### 5. The class that couldn't exist
SpaceNet 3's schema carries no footpath code — verified across all `56,251` features in all four AOIs. The channel was never supervised, so the mask lives in the head rather than only in the loss, and the exported ONNX is structurally unable to emit it (verified: constant `−1e4`).

Two consequences, a few sentences each: three-class surface macro-F1 was silently capped at `0.667` by a class that could never appear, so evaluation now names the classes lacking evidence alongside a present-classes score; and a previously reported 61.2% footpath-argmax figure did not reproduce (`0.00%`) and was withdrawn before the proposal was sent.

### 6. Spending the evidence
**The section no other portfolio page will have.**

**Do not open with "genuinely held-out."** That phrase is true in one sense (the cities were never trained on) and misleading in another (the outcome was inspected to choose a release candidate, which makes them development data). Leading with it and undercutting it a paragraph later is the same ambiguous-term trap §3 guards against for "Stage A" — and here the page would be setting the trap itself.

Open with the tension instead. Something in this shape:

> Stage B fine-tuning was scored on two cities the model had never trained on — Banepa, Nepal and Nhamatanda, Mozambique, real OpenAerialMap imagery against OpenStreetMap geometry — using gates written down before the run (`passes_khartoum_guard`, `passes_golden_improvement_rule`). The masked candidate improved mean road IoU from `0.2907` to `0.3628` and passed both. Then I looked at the result to pick a release candidate, and that act converted those two regions from evidence into development data.

Then the register entry, which is the point. From `docs/exposure-register.json`:

> "Outcome inspected, so this region is development data. It cannot serve as confirmation for any Stage B claim, including the seed 43/44 repeats that reuse it for median selection."

The same register notes that the reference labels are raw uncorrected OSM with no alignment or completeness gate, so *"agreement with these labels is not accuracy"* — and that Banepa's CRS is in degrees, which does not affect pixel IoU but would invalidate any metre-denominated scoring done there without reprojection.

That is the page's real argument. Anyone can report a held-out number. Writing down that you have consumed your held-out set, and thereby giving up the right to cite it as confirmation later, is a different thing.

### 7. Where it stands
With an explicit **"as of 2026-09-22"** line: four-city base model released with open weights; Khartoum figures are validation metrics from blocks that also chose the checkpoint; seed repeats planned and not run, so no noise floor exists; Stage B candidates evaluated but on regions now registered as exposed; a proposal submitted to a public open call on 2026-09-22 with no response; no state-of-the-art claim.

Then the alignment calibration, which is the best "what I'd do differently": pre-registered rules accepted 2 of 200 tiles, and inspection showed both accepted fits were wrong — HOT mappers had traced the OSM from the same imagery, so it was already aligned to within a few metres. Look at the overlays before building the rule chain. The pre-registration was right; the thing pre-registered was unnecessary.

## 6. The test count

**Correction.** An earlier draft of this spec claimed the existing spec's "1,189 test functions across 82 files" does not reproduce. **That was wrong, and the error was mine:** I counted `def test_` unanchored across every file, which also catches indented test methods inside classes and files that are not test modules. 1,189/82 reproduces exactly with the obvious method.

Counted at `9ae5385`, `^def test_` in `test_*.py` files only:

| Scope | Functions | Files |
|---|---|---|
| `roads_hot/` only | 981 | 65 |
| whole repository | **1,189** | **82** |

| (unanchored, all files — the flawed method) | 1,286 | 87 |

So the number is sound. **What is wrong in the existing spec is its scope label**, not its arithmetic: it says "a `roads_hot` package carrying 1,189 test functions across 82 files", but 1,189/82 is the *whole repository*. `roads_hot` alone is 981/65. The 82 files include tests under `models/`, which are not part of that package.

**Publish either, but label the scope correctly and state the method inline.** Recommended: **"1,189 test functions across 82 files"**, described as the repository's test suite rather than as `roads_hot`'s — it is the larger true number and it is what the whole engineering effort actually amounts to.

Say "test functions", not "passing tests", unless the suite has been run green at that commit and the run is recorded. Re-count at implementation time with `git grep -c "^def test_" <ref> -- '*/test_*.py' 'test_*.py'`.

## 7. Publication posture

- The proposal was **submitted on 2026-09-22** to HOT's public GeoAI open call. Tara is the source for that; it is not recorded in git.
- Say "submitted to an open call." **Never** imply acceptance, partnership, review, or any existing relationship with HOT.
- Keep "HOT" out of the stats strip. A nonprofit's name in a stats bar, before any relationship exists, reads differently from a body-text sentence.
- Link the HuggingFace model card, not the private source repo.

**The card is currently private** (Tara made it private on 2026-09-22 because it carried the unpinned table).

**Decision: ship with the real URL anyway.** `liveUrl` is `https://huggingface.co/tarabird90/dinov2s-roads`, label `Model card ↗`. Hardcoding the final URL now means the link starts working the moment the card goes public, with no edit and no redeploy.

The cost, so it is a known cost: `liveUrl` renders in **three** places, not one —

| Location | What the visitor sees |
|---|---|
| `BuildCard.astro:29` | the primary button on the **homepage** build card |
| `CaseStudy.astro:52` | the mint hero CTA on the case study |
| `CaseStudy.astro:84` | the closing CTA on the case study |

Until the card is public, all three are dead ends for a logged-out visitor. Tara is not driving traffic to the site in this window — it is not being sent out or promoted — so the exposure is small and the trade is worth it to avoid a follow-up edit. Revisit only if the site starts getting deliberate traffic before the card is public.

**Therefore, while the card is private:** do not describe the link as evidence in body text. Do not write "the weights are published, see the model card" or similar — the page must still make sense to someone who clicks and finds nothing. State that the model is released under open weights (true) without staking a sentence on the link resolving.

This is not just a caveat — it is the mechanism that makes the goal achievable. **Copy that does not depend on the link resolving reads correctly both before and after the card goes public, so making the card public becomes the only action required. No portfolio edit, no redeploy.**

### Go-live checklist: what this design does and does not force you to revisit

Written to make "make the card public" the single step.

| Trigger | Portfolio edit needed? |
|---|---|
| **Model card made public** | **None.** URL is already final; copy does not depend on it resolving; `OPEN WEIGHTS` and `status: 'wip'` are both already true and stay true. |
| Seed repeats complete | Yes — §5.3's "no noise floor" caveat becomes false, and the APLS delta finally gets error bars. Unavoidable; this is a *new result*, not a publication-state change. |
| HOT responds | Yes — §7's "no response" line. Unavoidable for the same reason. |
| Four-city per-city evaluation re-run and committed | Optional — §4's excluded table could be added. Not forced. |
| Source repo made public | Optional — a repo link could be added. Not forced. |

Only the first row is about going live, and it costs nothing. The others are triggered by the work moving, not by publication, and no design choice can pre-empt them — a page that states current results has to change when the results change.

**One thing to get right at authoring time, because it is the cheap way to reduce future edits:** write every status claim with its `as of 2026-09-22` date attached (§5.7), so a stale line reads as correctly-dated history rather than as a wrong claim. A dated sentence ages; an undated one becomes false.
- No state-of-the-art or benchmark claim.

## 8. Where it lives

A fourth build at `/builds/fair-roads`, reusing `CaseStudy.astro`.

| File | Change |
|---|---|
| `src/content/schema.ts` | add `'fair-roads'` to `slug`; add `'wip'` to `status` |
| `src/content/builds.ts` | new entry; **must include `stack`** if the homepage skills change has landed |
| `src/pages/builds/fair-roads.mdx` | the page |
| `src/content/__tests__/content.test.ts` | `builds.length` 3 → 4; update the hardcoded slug array |
| `src/layouts/CaseStudy.astro` | widen `status` Props to include `'wip'` |
| `src/components/BuildsSection.astro` | `md:grid-cols-3` → `md:grid-cols-2`; four cards in a three-column grid leaves an orphan |
| `public/screenshots/` | two new PNGs (§9) |

`StatusPill` already has a `wip` variant. Use a custom label — but **not** `STAGE A RELEASED` (§3). Suggested: `OPEN WEIGHTS`.

**Homepage card copy:**
- `oneLine`: "Open-weight road extraction for humanitarian mapping — and what its own numbers said to build next."
- `dates`: "2026 → ongoing"
- `stack`: `['DINOv2 ViT-S/14', 'UPerNet', 'ONNX']`

**Ordering:** place it first only if the stats strip and first heading read as competence without the surrounding prose. Otherwise second, behind Layoff Calculator.

**Stats strip** — achievement, not category labels, and nothing unpinned:

| Label | Value |
|---|---|
| BLOCK APLS | 0.286 → 0.394 |
| MODEL | DINOv2 ViT-S/14 + UPerNet · ONNX |
| ENGINEERING | 981 tests · distroless serve |
| ROLE | Sole engineer |

**Coordination:** this shares three files with `2026-09-22-homepage-skills-design.md`. See that spec's §13. Land this one first — it changes the build count that the homepage's lane 01 stat depends on.

## 9. Assets

Two clean PNGs, rendered by a script in the `fair-roads` repo so they are reproducible. Existing overlays are matplotlib figures with axes, tick labels and raw filenames in their titles, and both were produced by the **superseded Khartoum-only checkpoint**. Regenerate from the four-city checkpoint, or the page must not imply the figures show the released model.

The hero tile may have been in the training split, so it is a sanity check, not a performance number. Do not describe it as performance in body text.

This spans two repositories: assets are generated in `fair-roads`, the page lives in `portfolio`.

## 10. Do not quote

- **The four-city per-city table, pooled row, clDice column, and chip counts** — unpinned (§4)
- **1,189 test functions** — does not reproduce (§6)
- **"Stage A" unqualified** (§3)
- **The +0.014 Khartoum delta as an improvement** — inside the noise floor
- **Paris 0.6815 against Paris 0.386** as an improvement — different kinds of number, and the first is unpinned
- **"nearly doubles"** for the APLS result — the commit subject `1c2612b` says it; its own artifact shows mean `+38%`. The near-quadrupling is one block.
- **0.70 tile-level APLS** — predates a ground-truth converter fix
- **`topo_like_f1`** — marked do-not-publish in `roads_hot/metrics/connectivity.py`
- **61.2%** — except as the withdrawn figure in §5
- **The private source repo URL**
- **Any claim of HOT acceptance, partnership, endorsement, or review**
- **Any state-of-the-art or benchmark claim**
- **Any comparison against HOT's own published models**, including their building model's pixel IoU of `0.4276`. The project's own audit: *"the tasks, datasets and splits all differ — and theirs is a test split while ours is the validation split used for selection. The comparison is unsound."* A "we beat HOT's own number" line is a tempting thing for a case study to reach for and it is not supportable.
- **Any comparison against the earlier ResNet-34 U-Net control** — *"it used mismatched training seeds and its headline numbers are not those of the released checkpoint. Superseded."*
- **The four-city ONNX parity figure and the published artifact hashes**, until they have a committed artifact (§4).

### Used deliberately, against the project's own outreach decision: the 0.60 APLS target

`proposal-send-checklist.md` lists the internal `0.60` APLS target as **deliberately left out of the HOT proposal**:

> "APLS is not in fAIr's vocabulary at all. Introducing a metric they do not use in order to report failing a threshold they never set, then explaining they never set it, spends credibility for nothing."

§5.4 of this page is built on exactly that framing. The divergence is intentional and the reasoning is audience, not soundness:

- HOT are domain experts who would correctly respond *"we never set that bar"* — the framing spends credibility with them for no gain.
- A hiring manager reads it the opposite way. "Wrote a number down before the run, missed it, and diagnosed instead of moving the bar" is the most legible possible demonstration of pre-registration, and it needs the bar named to work at all.

**But the page must carry the same caveat the model card does, in the same breath:** the `0.60` is *this project's internal pre-registered target and is not a published HOT acceptance threshold.* Without that sentence, §5.4 implies a standard was imposed from outside and missed, which is false and would be the page's single most damaging misreading.

## 11. Voice

Match the existing case studies: first person, short declaratives, no hype. Do not make the rigor sound heroic; overselling honesty is self-defeating.

Bold the findings, not the confessions — the metric disagreement, the oracle ceiling, the 56,251-feature schema finding, the exposure register. Negatives stay in plain text, in full, with their explanation in the same sentence.

## 12. Open questions for Tara

0. **New, and not really about this page: the four-city release has no verification trail.** The Khartoum-only release got `reports/khartoum_stage_a_release/` and `reports/publication_20260921/artifact_verification.json` — hashes, parity, golden scores, all committed. The four-city release got none of that, and `stac-item.json` still names the old ONNX as "the released" one despite being stamped 2026-09-22 (§4). Worth closing independently of the case study; right now the published checkpoint's identity rests on a model card that is private.
1. ~~**The model card is private.**~~ **Resolved 2026-09-22.** Ship with the real URL and accept the dead link until the card goes public. See §7 for the three render sites and the body-copy constraint this imposes. **Not a publication blocker any more.**

   Still worth doing, and cheap: when the card is republished, remove the unpinned per-city table (§4) first. It is the reason the card went private, and republishing it unchanged puts those numbers back in public.
2. **Agent-direction disclosure.** The existing spec proposed a section saying the work is agent-directed, and flagged it for your veto; you never ruled. My recommendation: **include it**, in §6 where the evidence-spending argument already lives — directing agents and building the verification that catches their errors is the most relevant thing on this page for a Director of AI Engineering track, and the withdrawn 61.2% figure is the proof the verification works. But it is a positioning call and it is yours.
3. **Ordering** — first or second among the builds.

## 13. Verification before publish

- `npm test` passes; `npm run build` succeeds; `astro check` clean
- every number on the page traces to a committed artifact, re-checked against the source file at implementation time — not against this spec
- re-count the test suite; do not copy 981 forward without checking
- no §10 entry appears
- the page asserts no HOT relationship beyond "submitted to an open call"
- §1 does not promise footpath output
- the model-card link points at `https://huggingface.co/tarabird90/dinov2s-roads` exactly, so it starts working when the card is made public. It will **not** resolve for a logged-out visitor until then — that is expected (§7), not a bug to fix by changing the URL.
- no sentence on the page depends on that link resolving (§7)

## 14. Review trigger

Revisit on any of: a HOT response, a completed seed repeat (which would finally give the APLS delta a noise floor), a committed four-city per-city evaluation (which would unblock §4's table), or the source repository going public.
