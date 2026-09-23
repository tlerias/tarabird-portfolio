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

**Action for this page: omit both.** Do not put the parity figure or the artifact hashes on the page. A page arguing that numbers must trace to committed artifacts cannot itself lead with two that do not, and neither is load-bearing — the argument runs on the metric disagreement and the exposure register, not on a hash.

Fixing the underlying trail is Tara's, in a separate session (§12.0). **If it lands before this page is written**, the figures become quotable and this section can be revisited; that is a bonus, not a dependency. Implement as though it has not landed.

### Unpinned — must NOT appear

**The four-city per-city results table.** Paris, Shanghai, Las Vegas and the pooled row; every clDice value; the F1/precision/recall columns; all four validation chip counts. Per `docs/outreach/proposal-send-checklist.md`: *"none of which appear in any evaluation record on disk. Two independent checks found the same thing."*

This is the table the existing spec built its page around, and it was live on the HuggingFace card until Tara made the card private on 2026-09-22.

**Consequence for this page:** it cannot claim four-city coverage with per-city numbers. It can say the model was trained on four SpaceNet 3 cities — that is a fact about the training run, recorded in the run config — but the only per-city validation figure it may quote is Khartoum's `0.643`, because only Khartoum's was frozen in a pre-registered record.

If the four-city evaluation is ever re-run and committed, this section is the thing to revisit.

## 5. The arc

**Register, and it governs everything below: the page explains the project in plain English. The model card carries the technical specification.**

A reader should finish this page understanding what was built, what was learned, and why the judgement calls were hard — without knowing what a metric is called. Anyone who wants the specifics follows the model-card link.

**Do not put these on the page:** `IoU`, `clDice`, `APLS`, `macro-F1`, `ONNX`, `opset`, `sha256`, `logit`, `softmax`, `argmax`, `epoch`, `seed`, `checkpoint`, `chip`, `distroless`, `UPerNet`, `ViT-S/14`, bare decimal scores presented as if self-explanatory. Every one of these belongs on the card.

**Name the architecture once, in a sentence a non-specialist can read**, so a technical reader still sees competence — something like *"a vision transformer Meta released, with a segmentation head I trained on satellite road labels."* One sentence, not a spec table.

**Numbers on the page must arrive with their meaning attached.** Never `0.286 → 0.394`. Write what changed and by how much, in the unit a reader cares about.

Seven sections. Two carry results, three carry method, one carries the finding the page exists for, one carries status.

### 1. What it does
Volunteers at the Humanitarian OpenStreetMap Team trace roads by hand from satellite imagery, in places where no usable map exists — which is where disaster response and aid delivery need maps most. This model does the first pass: give it a satellite tile and it draws the roads it finds and labels each one paved or unpaved. A person still checks and corrects the result. The job is turning a blank map into a draft.

**Say here that it cannot do footpaths.** The model declares three road surfaces and can only produce two. If the page waits until §5 to admit that, it has already contradicted itself twice. One sentence is enough: it is supposed to spot footpaths, it can't yet, and §5 explains why.

### 2. What got built
Short, plain inventory — this is the "she ships" section, and the neighbouring case studies each show a shipped thing. In readable terms: the model and its training pipeline; a test suite (§6 for the count and how to state it); a packaged version that runs on an ordinary server with no graphics card; the work to make it plug into HOT's own platform; and a pipeline that pulled and prepared twenty thousand satellite tiles across five regions.

No narrative, no adjectives. A list a reader skims in ten seconds.

### 3. Two ways of scoring, and they disagreed
**The centerpiece, and it is explainable without a single metric name.**

I retrained the model on four cities instead of one, and measured what changed. Two different ways of scoring gave two different answers.

The first counts how much of the road surface the model got right, pixel by pixel. By that measure almost nothing changed.

The second asks a different question: do the roads it draws actually join up into a network you could trace a route across? By that measure it improved by about **38%**.

That gap is the interesting part, and it matters for a real reason. A mapper doesn't need pixels — they need roads that connect. A map that is mostly accurate but broken into disconnected fragments is far less useful than the first score makes it sound, and the first score cannot see the difference.

**What the page must not claim.** State the disagreement as the observation and stop short of the cause. An earlier draft asserted that the pixel score "was not measuring the thing the product needs." That is not earned:

- the new model also **trained for longer**, so "more cities" and "more training" are tangled together and this experiment cannot separate them
- it ran **once**. Nobody has measured how much these scores bounce around between identical runs, so some of that 38% could be luck
- the runs that would have settled it were started and stopped before finishing

So: two honest measurements disagreed, one reading is that the simpler score was blind to something that matters, and the experiment as run cannot prove it. Say that. The section's worth is that the disagreement got chased rather than rounded off in the flattering direction — not that the answer is known.

### 4. Checking the ruler before blaming the model
Before running anything, I wrote down the score I wanted to reach. I missed it.

The tempting response is to adjust settings until the number improves. I tried 53 combinations. None came close.

So I checked the ruler instead: I took the **correct answer** — the human-drawn map — and fed it through the same scoring machinery as if a model had produced it. It scored about **0.79 out of a possible 1.0**, so the scoring was working; a near-perfect answer scores near-perfect. The model really was the weaker part, and specifically because its roads came out in disconnected pieces. That told me where the next month should go: connecting roads, not tuning settings.

Two things to keep honest in the body: the settings were chosen using the same data they were then scored on, so even the best figure flatters itself; and the setting I picked made the *worst* area worse, because the selection rule chased the average and the weakest case paid for it.

**Required caveat, in the same breath:** that target was mine. I set it for this project. It is not a threshold anyone else imposed or would have judged the work against.

### 5. Grading against a category that could not exist
The model has three labels for road surface. One of them — footpath — it can never output, and that is a property of the training data, not a bug. I checked every road in the dataset: **56,251 of them, not one a footpath.** It is a dataset of vehicle roads.

So the model was being graded on a category that could not appear, which quietly capped its best possible surface score at two-thirds no matter how well it performed. I switched that label off, and changed the scoring so it names the categories it has no evidence for instead of averaging in zeros.

I had also reported a footpath accuracy figure earlier. When I went to reproduce it, it came out at zero. I withdrew it before the proposal went out. It had only ever existed in prose — never in a saved measurement — which is exactly why it survived as long as it did.

### 6. Spending the evidence
**The closing argument, and the section no other portfolio page will have.**

I tested on two towns the model had never trained on — Banepa in Nepal and Nhamatanda in Mozambique — with the rules for what would count as an improvement written down before I looked. The fine-tuned version did better on both, and cleared the bar I had set in advance.

**No numbers in that sentence, deliberately** (§8). The size of the gain is not what this section is about, and quoting it invites the reader to weigh it instead of noticing what happens next.

Then I used those results to decide which version to ship. **That decision spent them.** Once you have chosen something because of how it scored on a test, that test is no longer an independent check on it — it has become part of how the thing was built. So I recorded that in the project's own files:

> "Outcome inspected, so this region is development data. It cannot serve as confirmation for any Stage B claim, including the seed 43/44 repeats that reuse it for median selection."

Two towns, permanently retired as evidence, written down voluntarily.

The same record notes that the reference maps those towns were scored against are raw community-contributed data, never hand-checked — so agreement with them is agreement, not correctness.

Nothing forces this bookkeeping. It only ever costs you something. It is also the difference between a number you can rely on and a number that merely sounds good, which is the whole argument of this page.

### 7. Where it stands
Dated explicitly, **"as of 2026-09-22"**: the four-city model is released with open weights; the figures come from data that also chose the model, so they are not an independent test; the repeat runs that would put error bars on §3 were started and stopped; the fine-tuned versions were evaluated but on towns now retired as evidence; a proposal went to a public open call on 2026-09-22 with no response yet; no claim that any of this is state of the art.

Then the best "what I'd do differently": I built a rule-based system to detect when the satellite imagery and the map were misaligned. It accepted 2 tiles out of 200 — and when I looked at those two, both were wrong. The maps had been traced from the same imagery, so they were already aligned. Writing the rules down in advance was right. The thing I wrote rules for did not need solving. Look at the pictures before building the machinery.

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

**Stats strip — four rows, and no metrics in any of them.**

| Label | Value |
|---|---|
| MODEL AT | huggingface.co/tarabird90/dinov2s-roads |
| BUILT WITH | Vision transformer + segmentation head |
| ROLE | Sole engineer |
| STATUS | Open weights · 2026 → ongoing |

This matches what the site already does. Every existing case study uses exactly four rows, and they are **orientation, not evidence**:

| Page | Rows | Performance numbers |
|---|---|---|
| `severance` | `LIVE AT` · `STACK` · `ROLE` · `SHIPPED` | 0 |
| `rollcall` | `LIVE AT` · `STACK` · `ROLE` · `SHIPPED` | 0 |
| `knock-it-off` | `PLAY AT` · `BUILT WITH` · `ROUND LENGTH` · `PLAYTESTED BY` | 1, and it is a joke |

A strip that led with `BLOCK APLS | 0.286 → 0.394` — as an earlier draft did — would make this page read like it came from a different site, and a bare decimal pair under an acronym is the least useful thing a hiring manager could meet first. The achievement belongs in the body, in the sentence that makes it mean something.

`MODEL AT` will not resolve while the card is private (§7). That is accepted and it is why the row is a destination, not a claim.

### How many numbers on the page at all

**Target: five to seven in the entire body.** The existing case studies run 4–7 including years and version strings, so this page is already the most number-heavy of the four and should not push further.

The test: **a number earns its place only if deleting it would change what a reader believes.**

Keep, in priority order:

1. **56,251 roads, not one a footpath** — irreplaceable; it *is* the finding
2. **"+38% better connected" against "almost nothing changed"** — the centerpiece, and only as a pair; separately, neither means anything
3. **0.79 out of a possible 1.0** — makes the ruler-check argument work
4. **53 combinations tried** — evidence the restraint was real rather than claimed
5. **two towns retired** — §5.6
6. **1,189 tests** — the "she ships" proof

Cut from the page (they remain in §4 for the implementer, and on the model card): every hash, the parity figure, the zero-shot trio, the held-out before/after pair, chip counts, epoch numbers, block counts, file sizes.

Note §5.6 needs **no** number at all once cut this way: *"it did better on both, and it passed the bar I'd set in advance"* carries the section, because the point is that the evidence was spent, not the size of the gain.

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

**Plain English is a hard requirement, not a preference** (§5). Tara's instruction: the case study explains what the project is; the technical jargon lives on the model card. The test to apply to every sentence: *would someone who has never trained a model follow this?* If not, rewrite it — do not add a parenthetical definition, which is how pages end up technical anyway.

Three rules that do most of the work:

1. **Describe what a number measures, never name the metric.** "whether the roads join up into a network you could route across", not "clDice" or "APLS".
2. **Give numbers a unit or a comparison.** "+38% better connected" or "0.79 out of a possible 1.0", never a bare `0.394`.
3. **Explain by consequence.** "a map broken into disconnected fragments is far less useful to a mapper than the score suggests" does more than any definition.

This is not dumbing down. The judgement calls are the hard part of this project and they are all expressible in plain language — the metric names were never carrying the insight.

Bold the findings, not the confessions — the metric disagreement, the oracle ceiling, the 56,251-feature schema finding, the exposure register. Negatives stay in plain text, in full, with their explanation in the same sentence.

## 12. Open questions for Tara

0. ~~**The four-city release has no verification trail.**~~ **Delegated 2026-09-22.** Tara is handling the model card and its artifacts in a separate session, before going public. Not a task for whoever implements this page.

   The handoff list, so it is not lost: republish the card **without** the unpinned per-city table (§4); commit `onnx_parity.json` into `reports/` so the four-city parity figure is checkable from git; update `models/dinov2s_roads/stac-item.json`, which is stamped `2026-09-22` but still names the superseded ONNX (`dbdc48fa…`) as "the released" one; and refresh `models/dinov2s_roads/README.md`, which still describes the Khartoum-only release throughout.
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
