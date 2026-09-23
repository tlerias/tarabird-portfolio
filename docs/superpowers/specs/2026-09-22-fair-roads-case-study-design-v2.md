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

**Do not put these in the case-study page's prose:** `IoU`, `clDice`, `APLS`, `macro-F1`, `ONNX`, `opset`, `sha256`, `logit`, `softmax`, `argmax`, `epoch`, `seed`, `checkpoint`, `chip`, `distroless`, `UPerNet`, `ViT-S/14`, bare decimal scores presented as if self-explanatory. Every one of these belongs on the model card.

**Two scoped exceptions, so the ban is not read wider than intended:**

1. **The homepage build card's `stack` tags** (`['DINOv2 ViT-S/14', 'UPerNet', 'ONNX']`, §8) are exempt. Every build on that homepage grid carries stack tags — `severance` shows `Next.js · TypeScript · Supabase` — and dropping them for this one build alone would break an established site pattern to no benefit. A three-chip tag row is a different thing from prose: nobody reads it as an explanation.
2. **Verbatim quotations of project records** may contain banned terms, because their value is that they are real artifacts. §5.6's exposure-register quote is the only one. Mark any truncation with `[…]` — do not silently shorten a quote, which is a defect this project has already had caught once.

**Name the architecture once, in a sentence a non-specialist can read**, so a technical reader still sees competence — something like *"a vision transformer Meta released, with a segmentation head I trained on satellite road labels."* One sentence, not a spec table.

**Numbers on the page must arrive with their meaning attached.** Never `0.286 → 0.394`. Write what changed and by how much, in the unit a reader cares about.

### Structure: a timeline, with a "you are here" marker

**Decided by Tara 2026-09-23. The page is a timeline**, not a sequence of essay sections, with the current position marked at **Proposal submitted**.

Three reasons this is the right spine, beyond being what was asked for:

1. **It makes status structural rather than a closing paragraph.** An "as of" date at the bottom is easy to skim past; a marker two-thirds down a timeline, with visibly unfinished stages below it, cannot be misread as a finished project.
2. **It demotes the performance numbers to one beat among many.** That is exactly the reframing §5.1 argues for — the model's score is a step, not the point.
3. **It makes the un-owned steps visible.** Everything after the marker depends on HOT, on mappers, on a merge. Showing them greyed-out-but-named is the most honest possible statement of where the work sits, and it is more interesting than a claim of completion.

**Stages, in order.** Everything up to and including the marker is `done`/`now`; everything after is `ahead` and must be visually distinct.

| # | Stage | Status |
|---|---|---|
| 1 | Asked before building — four questions to the open call; the answers changed the design | done |
| 2 | Built a base model on one city | done |
| 3 | Two ways of scoring disagreed | done |
| 4 | Checked the ruler before blaming the model | done |
| 5 | Found a class that could not exist | done |
| 6 | Retrained on four cities | done |
| 7 | Rehearsed the real use case — fine-tuned onto two unfamiliar towns | done |
| 8 | Published the model for anyone to download | done |
| **9** | **Proposal submitted — 22 September 2026** | **now** |
| 10 | Acceptance, and a grant agreement | ahead |
| 11 | A pull request into HOT's model repository | ahead |
| 12 | Merged — the model goes live in fAIr | ahead |
| 13 | Mappers fine-tune it for their own districts | ahead |
| 14 | Predictions become OpenStreetMap edits | ahead |

Stage 1 is worth keeping prominent: asking four specific questions before writing code, and changing the design because of the answers, is a stronger opening than any metric on the page.

Stages 10–14 are the four-step chain above, plus acceptance. **They must read as description of a published process, never as prediction.** No dates, no likelihood, no "when this ships". The honest register is "this is what happens next, and none of it is mine to control."

"How this was built" (the agent-direction disclosure, §5.7) sits **outside** the timeline, after it — it is about method across the whole project, not a stage in it.

### 1. Why anyone needs this, and what "good" means

**Revised 2026-09-23 on Tara's instruction: the page must make a reader understand why the model matters, not just how it performs.** An earlier draft opened with mechanics and never explained the stakes or the platform, which left the performance sections carrying an argument they cannot make on their own.

Three beats, sourced from the project's own outreach material:

1. **The problem.** Large parts of the world have no usable map, and that correlates with where maps matter most. HOT volunteers close the gap by tracing roads by hand — effective, enormously slow.
2. **What fAIr is.** HOT's open call describes the platform as connective tissue between people building geospatial ML models and the mapping communities who need them, *"without requiring users to be AI/ML engineers."* The gap it exists to close: models get built in labs while the communities mapping their own neighbourhoods have no practical route to using them, and without local feedback those models never improve where they are most needed.
3. **What "good" means here, and this reframes the whole page.** fAIr models are **base models** — *"a reusable ML blueprint that users can finetune on their own datasets"* (`docs/outreach/sources/fair-models-contributing-model.md`). So the figure that decides usefulness is not a benchmark score. A model that scores well on four benchmark cities and adapts badly to a town in Nepal is *worse*, for this platform, than one that starts lower and improves quickly on local data.

**Beat 3 must be told as the full four-step chain, not summarised as "communities fine-tune it."** An earlier draft stopped at step 1 and lost the point. Tara's own account of the pipeline, which the page should follow:

1. **The author hands over a container, not a service.** A pull request to `hotosm/fAIr-models` carrying a STAC item and two container images (`mlm:training`, `mlm:inference`). A HOT admin reviews, merges, and triggers registration; registration reads the STAC item, mirrors the weights, and deploys the inference image as a live endpoint on HOT's infrastructure. The author never touches a server. **The entire deliverable is a container that behaves correctly when someone else runs it.**
2. **A mapper previews it.** They open fAIr, choose Roads where today only Buildings exists, pick imagery, draw a box, and get suggested road geometry back. No login, nothing installed.
3. **A mapper adapts it.** The generic model does not know their district's conventions. They draw their area; fAIr fetches existing map data and imagery, builds a training set, and fine-tunes the base checkpoint into *their own* model. They write no code and need not know what fine-tuning is.
4. **It becomes map data.** Accepted predictions are pushed into OpenStreetMap as real edits — a road that was not on the map is now on the map, somewhere someone is trying to route aid.

**Step 4 is the only one that counts**, and steps 1–3 are plumbing in service of it. Say so.

This makes §5.6 a **rehearsal of step 3**, not a rigour anecdote — the one step that creates the value is the one Tara does not control, so demonstrating that her base model adapts well to an unfamiliar town is the most relevant evidence on the page.

### Do not publish, from the same account

These are in-flight platform findings from Tara's own debugging, and they belong nowhere near a public portfolio page:

- that `/ai-models` and `/datasets` currently 404 on a fresh `develop` build, so step 3 is API-only until the frontend catches up
- that the model currently registered in her local test is an untrained stub
- any characterisation of fAIr's UI as broken, incomplete, or behind its backend

Publishing these means broadcasting an unreleased product's defects, to an organisation she has an open proposal with, on a page whose entire credibility rests on being careful. The chain above is describable entirely in the present tense of what the platform is *for*, which is what a reader needs. Step 2 may note that Roads is not currently an option on fAIr — that is the novelty of the contribution, not a criticism.

Then the mechanics: a satellite tile in, roads drawn and labelled paved or unpaved, a person still checking and correcting. Turning a blank map into a draft.

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

**Three caveats the plain-English draft dropped, and must carry.** They come from the same `cannot_conclude` block as the two below, and a revision review caught their loss:

1. **Still a long way from solved.** This is the most important and the easiest to lose: without it a reader meets "+38% better connected" and concludes connectivity is fixed. **§5.3 must say plainly that the result is still roughly half what the hand-drawn map scores through the same machinery.** Do *not* express this as "below my target" — that target is cut from the page entirely (§10). Note also that §5.4's 53-combination sweep is on the **earlier single-city model** (`sweep.json`'s checkpoint is `khartoum_stageA_…`), not the four-city one §5.3 reports, so §5.4 must say which model it is talking about or the two sections read as one experiment.
2. **Agreement, not correctness.** The ground truth is one organisation's own annotations. The page's only "agreement not correctness" line currently sits in §5.6 and is about a different dataset entirely, so it does not cover this.
3. **Four of five areas scored**, the fifth having no roads to check against. The whole 38% rests on four data points.

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

**Precision guard — this project has already got this wrong once.** Say *"none of its road types is a footpath."* Do **not** say the dataset has no road types or no road hierarchy: it has seven (`road_type` 1–7), and the project's own loader reads them. An earlier draft of the grant proposal made exactly that overstatement and a reviewer caught it. The true and narrower claim is the one that carries the finding anyway.

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

### 7. How this was built
**Approved by Tara 2026-09-23. Include it.** For a Director of AI Engineering track this is the most relevant section on the page, and the repository would make it discoverable anyway. One honest passage, no defensiveness, no apology.

The shape, in plain language:

> I didn't write most of this code by hand. I directed AI agents to write it, and spent my own time on the part that needed me — deciding what to build, and building the checks that catch the agents when they are wrong.
>
> That second part is most of the engineering. Three examples from this project:
>
> - The footpath accuracy figure above existed only in prose and a commit message. It had never been written to a saved measurement. The checks are what caught that it didn't reproduce.
> - Every figure in the grant proposal was audited against saved measurements before it went out, and the ones with no saved record were cut — including a results table I would have been glad to publish.
> - Every significant document went to reviewers running on different models from the one that wrote it, read-only, so they could not quietly fix what they found.
>
> One of those reviews checked a revision rather than an original, and found **seven** new mistakes the revision itself had introduced. That is the number I'd point at. Rewriting introduces errors at about the same rate as writing, and the only reason I can tell you that is that I measured it.

**Sourced:** `docs/outreach/proposal-send-checklist.md`, sections "Independent review, 2026-09-22" and "Third review, 2026-09-22 (of the revision)" — *"A third reviewer, again on a different model and read-only, checked the revision specifically for defects the rewrite introduced … It found seven, all now fixed."*

**The seven is the seventh number on the page**, taking §8's budget to its ceiling. It earns the slot: it is the only quantified claim about the verification practice, and without it this section is an assertion about rigour rather than a measurement of it. If a number must be cut to stay in budget, cut `53 combinations` before this one.

**Do not** describe the agents by vendor or product name, do not turn this into a methodology essay, and do not claim the practice is novel. It is one passage.

### 8. Where it stands
Dated explicitly, **"as of 2026-09-22"**: the four-city model is published for anyone to download; the figures come from data that also chose the model, so they are not an independent test; the repeat runs that would put error bars on §3 were started and stopped; the fine-tuned versions were evaluated but on towns now retired as evidence; a proposal went to a public open call on 2026-09-22 with no response yet; no claim that any of this is state of the art.

**Then a short "what happens if it's accepted" passage.** Readers who understand §5.1's stakes will ask it, and the project's own sources answer it precisely — from the organiser's reply of 2026-09-16: *"First proposal needs to be submitted and upon acceptance (you will receive grant agreement) & you can start working on the PR and once the PR is merged grant would be released… current funding duration runs out by end of December."*

So: acceptance is a grant agreement, not a finish line; the real work is a pull request into HOT's model repository, reviewed by their team; the grant releases on merge; and there is a year-end deadline attached. Say that **merging is the point** — a model on a download page is a research artifact, a model merged into fAIr is one a community can fine-tune and use without anyone on their team understanding machine learning.

**Do not** overstate this into a claim about likelihood, timeline, or any relationship with HOT beyond a submitted proposal (§7, §10). It is a description of a published process, ending in "and it is still ahead of me."

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

`StatusPill` already has a `wip` variant. Use a custom label — but **not** `STAGE A RELEASED` (§3). Use `PROPOSAL SUBMITTED` — it is the actual status, and it reads clearly next to the other cards' `LIVE` pills.

**Homepage card copy:**
- `oneLine`: "Open-weight road extraction for humanitarian mapping — and what its own numbers said to build next."
- `dates`: "Sept 2026 · proposal submitted"
- `stack`: `['DINOv2 ViT-S/14', 'UPerNet', 'ONNX']`

**Ordering: first. Decided by Tara 2026-09-23** — ahead of Layoff Calculator, Rollcall and Knock It Off.

Implementation: `fair-roads` becomes the first entry in `src/content/builds.ts`, which is the array `BuildsSection` maps over, so ordering is array order and needs no sort logic. The slug assertion in `content.test.ts` must be updated to `['fair-roads', 'severance', 'rollcall', 'knock-it-off']` to match.

**What this decision costs, so it is built for rather than discovered:** the first card in the grid is the one every visitor sees, and many will read nothing else. It is now the ML project rather than the most immediately graspable one — a layoff calculator explains itself in four words; a road-extraction model does not. Two consequences:

1. **`oneLine` is doing more work than any other copy on the site.** It is the whole impression for a majority of visitors. It must say what the thing *is* and who it is for, in plain words, with no metric and no acronym.
2. **The first card must not be the one with a dead link.** `MODEL AT` will not resolve while the card is private (§7). That was an acceptable cost in third position; in first position it is the first thing anyone clicks. This does not reverse the ordering decision, but it does raise the priority of the model-card republish (§12.0) from "before going public" to "before this ordering ships."

**Stats strip — four rows, and no metrics in any of them.**

| Label | Value |
|---|---|
| MODEL AT | huggingface.co/tarabird90/dinov2s-roads |
| BUILT WITH | Vision transformer + segmentation head |
| ROLE | Sole engineer |
| STATUS | Model downloadable · proposal submitted |

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
7. **seven mistakes found in one revision** (§5.7) — the only quantified claim about the verification practice; without it that section asserts rigour instead of measuring it

**That is seven, the ceiling.** Nothing further may be added without removing one. If something must go, `53 combinations` is the weakest — its point ("I tried the tempting thing and it didn't work") survives without the count.

**What the budget counts, because an earlier draft was ambiguous and an audit read it the other way:** *quantified claims about the model's performance or the project's scale.* It does **not** count numbers that are part of describing the thing at all — "three road surfaces, only two of them produced" (which *is* the footpath finding), "four cities instead of one", "twenty thousand tiles across five regions", "two-thirds", "zero", dates, or "2 tiles out of 200" in the closing anecdote. Deleting those breaks sentences rather than removing claims, so the budget's own admission test does not apply to them. Counting every numeral instead puts the page at fifteen-plus and makes the budget unusable.

**Also note:** `1,189` lives in §5.2 (What got built), not in §6 — §6 is the implementer's note on how to count it correctly, not page copy.

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
- **The internal 0.60 connectivity target.** Arbitrary, and cut from the page by decision (see below). The 0.79 reference-map comparison replaces it.
- **Any comparison against the earlier ResNet-34 U-Net control** — *"it used mismatched training seeds and its headline numbers are not those of the released checkpoint. Superseded."*
- **The four-city ONNX parity figure and the published artifact hashes**, until they have a committed artifact (§4).

### The internal 0.60 target — cut from the page entirely

**Decided by Tara, 2026-09-23: the target does not appear.** An earlier draft of this spec argued to keep it, reasoning that "wrote a number down, missed it, diagnosed instead of moving the bar" is a legible demonstration of pre-registration. That argument was wrong on three counts:

1. **The number is arbitrary.** It was chosen, not derived. Naming it hands the reader a negative anchor they have no way to evaluate — "missed my target" reads as failure whether or not the target was sensible.
2. **The project already decided this** for a more expert audience. `proposal-send-checklist.md` lists it as deliberately left out of the HOT proposal: *"APLS is not in fAIr's vocabulary at all. Introducing a metric they do not use in order to report failing a threshold they never set, then explaining they never set it, spends credibility for nothing."* If domain experts would read it that way, a hiring manager has less context, not more.
3. **§5.4's argument does not need it.** The section is about checking whether the ruler works before blaming the model. That stands without any target.

**Pre-registration is still demonstrated, and better, in §5.6** — rules written down in advance that actually gated a shipping decision, rather than a number picked at the start.

**What replaces it as the yardstick, in both §5.3 and §5.4:** the hand-drawn reference map scores about **0.79** through the same scoring machinery; the model scores roughly half that. That comparison is *measured rather than chosen*, it needs no external standard, and it gives the reader something they can actually judge — a near-perfect input scores 0.79, so 0.39 is genuinely mid-range and not an artifact of a harsh scale.

Add `the internal 0.60 target` to the do-not-quote list above.

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
2. ~~**Agent-direction disclosure.**~~ **Decided 2026-09-23: include it.** Written as §5.7, built on the project's own review record rather than on assertion.
3. ~~**Ordering.**~~ **Decided 2026-09-23: first**, ahead of Layoff Calculator. See §8 for what that costs and the one thing it makes urgent.

**No open questions remain.** The spec is implementable once the revision review (in flight at time of writing) is resolved.

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
