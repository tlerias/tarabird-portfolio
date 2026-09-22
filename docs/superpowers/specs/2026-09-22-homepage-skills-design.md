# Homepage Skills Showcase — Design Spec

**Owner:** Tara Bird
**Date:** 2026-09-22
**Status:** Draft for approval
**Supersedes:** nothing. Extends `2026-05-14-tarabird-portfolio-design.md`.

---

## 1. Problem

The homepage does not say what Tara can do. Sections run Hero → Marquee → Builds → Career → Off-keyboard → Off the clock → Say hi. There is no statement of capability, no technical surface, and no evidence of leadership beyond a single hero line.

The hardest evidence is buried. Every Gusto metric lives only on `/career`, a subpage reached by scrolling past four homepage sections and clicking through. A visitor evaluating Tara for paid work never sees it.

"Yes I take contract work" (`ContactSection.astro:14`) sits in the final content section, below the fold, with nothing above it describing what that work would be.

## 2. What changed since the 2026-05-14 spec

The original audience ranking was: (1) personal artifact, (2) network/strangers, (3) contracting clients, (4) engineering peers, (5) founders.

**Contracting has moved up.** Landing paid work is now a real goal. The skills content has a job to do beyond self-expression, and the contract CTA cannot stay in the footer.

The voice constraint from §1 of the original spec is unchanged and still binding: *playful + craftsperson + wry, never childish, never corporate.* A skills section is the single most likely element on this page to violate it. Every decision below is constrained by that.

## 3. Scope of the offer

Tara will take on all four of:

1. Hands-on product build
2. Integrations and platform work
3. Engineering leadership and ops
4. Advisory, teaching, and speaking

**Known risk, accepted:** a four-way offer reads as unfocused to a client scanning for "does she do my thing?" This is Tara's decision and it is honest. The design compensates structurally rather than by narrowing scope: each lane is stated as a concrete outcome and carries its own proof number, so the section reads as four demonstrated capabilities rather than a list of services.

Lane 4 was originally "advisory & speaking," whose only evidence (Kinetic Minds, Heart & Hammer) already appears in the Off-keyboard section. It is reframed as **enablement** — getting teams productive with new tools — which gives it proof of its own (+57% PR throughput) and still contains the workshop and speaking work.

## 4. Attribution

Every Gusto metric is a team outcome under Tara's leadership. `/career` says "my team delivered."

**Decision: explicit "teams I led" framing.** Solo builds carry "I"; Gusto work carries "teams I led." Ambiguous attribution would read stronger at a glance but creates a gap between the homepage and `/career` that a client who digs will find. For the fractional-leadership lane specifically, a leadership-attributed number is stronger proof than a solo one.

## 5. Metric provenance and the qualifier problem

**Every number in this section traces to a single source: prose Tara wrote in the 2026-05-14 spec, reproduced in `src/pages/career.astro:43`. There is no underlying data in this repository** — no dashboard export, no incident counts, no PR metrics. The claims rest on memory of one quarter.

Source sentence:

> "In a single recent quarter, my team delivered a new partner integration end-to-end, cut sync error rates from **15% to 7%**, reduced average time-to-resolve from twenty days to nine, removed approximately **15,000 lines of legacy code** and millions of obsolete rows as part of a multi-quarter monolith extraction, and migrated **85 GraphQL objects** to a new authorization layer. We drove a **92% reduction** in weekly production errors in the closing weeks of the quarter and posted a **+57% PR throughput gain** during an AI-tooling sprint."

| Metric | Qualifier in source | Homepage-safe |
|---|---|---|
| Sync errors 15% → 7% | "in a single recent quarter" | Yes |
| TTR 20 days → 9 | "in a single recent quarter" | Yes |
| ~15,000 LOC removed | "multi-quarter monolith extraction" | Yes (unused) |
| 85 GraphQL objects | none | Yes (unused) |
| −92% weekly prod errors | **"in the closing weeks of the quarter"** | **No** |
| +57% PR throughput | "during an AI-tooling sprint" | Yes, with sprint named |

**The −92% figure is excluded from the homepage.** A reduction measured over the closing weeks of a quarter is a trend at a moment, not an outcome that held. Rendered as a bare stat tile it becomes a claim the source does not support, and it is the claim a technical client is most likely to ask about. It stays on `/career`, where its qualifier travels with it.

Lane 03 uses **time-to-resolve, 20 days → 9** instead: no measurement-window caveat, an operations-and-process win rather than a point-in-time trend, and closer to what a fractional tech leader is actually hired to fix.

**Open action for Tara, outside this implementation:** confirm 15% → 7% and 20 days → 9 against the original dashboards before these ship. They are the two numbers a prospective client may ask her to walk through.

## 6. Structure

Approach chosen: **show, then offer.** Builds stays first and earns the right to make claims; claims then arrive with receipts attached.

```
Hero                    edited — subhead names availability; 2nd CTA retargeted
Marquee (now)           unchanged
§ 01 Builds             edited — stack tags per card
§ 02 What I do          NEW
§ 03 Career             unchanged
§ 04 Off-keyboard       unchanged (renumbered)
§ 05 Off the clock      unchanged (renumbered)
§ 06 Say hi             edited — contract CTA promoted
```

Rejected: *offer up front* (capabilities before Builds) — fastest answer for a scanning client, but front-loads the broadest claims in the most prominent slot, which makes the four-way-offer vagueness worse and is most likely to read corporate. Rejected: *woven through* (no section, just a stat band and inline metrics) — safest for the voice, but never gives a client one clear statement of what they can hire her for.

## 7. Section 02 — content and layout

**Layout: stacked rows, one per lane.** Not a card grid. Four titles scan in about two seconds, and rows are visually distinct from Builds above and Off-keyboard below — the page already has two grid-of-cards sections and a third would flatten it.

**Header:** `02 / what i do` → "What you can **hire me** for." (mint highlight on *hire me*), mint squiggle beneath, `taking on work · 2026` kicker right-aligned.

`SectionHeader.astro` supplies the number, label, squiggle and heading only — its props are `number`, `label`, `squiggleColor`, `squiggleWidth`, `labelColor`. **It has no `kicker` prop.** Follow `BuildsSection.astro:14`, where the kicker is a sibling `<div>` inside a `flex justify-between items-end` wrapper. Do not add a `kicker` prop to `SectionHeader` for this.

**Row grid:** `title/number` | `description` | `stat + tags`.

All four rows use the **identical** `grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(220px, 0.9fr)`. Columns must align across rows. Do not size the third column `auto` — stat strings differ in length and `auto` would let each row's columns land in a different place. Alignment comes from a shared fixed template, not from table semantics. Collapses to a single stacked column below 820px.

**The four rows:**

| # | Title | Description | Stat | Caption | Tags |
|---|---|---|---|---|---|
| 01 | Ship the whole product. | Idea to live URL, solo. Design, build, deploy, and the unglamorous parts after launch. | `3` | products live, built alone | Next.js, Supabase, Godot |
| 02 | Make systems talk. | Partner APIs, accounting platforms, sync pipelines that fail quietly until someone makes them stop. | `15% → 7%` | sync errors · teams I led | QuickBooks, Xero, Sage Intacct |
| 03 | Run the engineering team. | Fractional tech leadership. On-call rotations, ops reviews, calibration — the infrastructure that makes leadership scale. | `20 days → 9` | time-to-resolve · teams I led | 2 teams, 5 engineers |
| 04 | Get a team productive with new tools. | AI tooling adoption, workshops, and teaching people who have never written a line of code. | `+57%` | PR throughput · AI-tooling sprint | AI tooling, Workshops |

Stat strings are written as spoken, not abbreviated — `20 days → 9`, never `20d → 9d`. `15% → 7%` is left as-is: screen readers pronounce `%` correctly, and the `→` sits inside a labelled `<dl>` pair (§8) so the relationship is already conveyed.

**Lane 02 tags — corrected.** An earlier draft tagged this row `GraphQL, Rails, Partner APIs`. **`Rails` has no source.** The only occurrence of "Rails" in the repository is Tara's early-career "we taught ourselves Ruby on Rails" story from Kapost (`career.astro:29`), which has nothing to do with the Gusto Pro Integrations stack this row claims. That is exactly the failure §5 exists to prevent, and §5's discipline was not applied to it. The tags are replaced with the named integration partners, which **are** sourced (`career.astro:41`): QuickBooks Online, Xero, FreshBooks, Sage Intacct. `GraphQL` is separately supported ("migrated 85 GraphQL objects") and may be used, but naming partners is stronger proof for a client than naming a query language.

**Voice check.** Review raised that the four row titles carry none of the site's signature devices — no `Highlight` colour-block word, no first person, no wry beat — and therefore read corporate, in violation of §2.

Partly accepted. On inspection the device is used at **section-title** level, not item level: every item title on this site is plain, and three of them are plain-with-a-period (`Heart & Hammer`, `Kinetic Minds`, `Jiu-jitsu.`, `Gardening.`, `Layoff Calculator`, `Rollcall`). Row titles are item titles, so "Ship the whole product." matches the established pattern rather than breaking it, and the section heading already carries the `Highlight` ("What you can **hire me** for.").

Two titles are still weak and are flagged for Tara's decision, not resolved here:

- **`Get a team productive with new tools.`** — the most corporate line in the section. Consultant-deck phrasing.
- **`Make systems talk.`** — serviceable, but close to integrations-vendor boilerplate.

These are Tara's voice, not the implementer's, and must not be rewritten during implementation. Ship the titles above verbatim unless Tara replaces them first.

**Section closes** with an anchor into `#say-hi`: "Any of these sound like your problem? →"

**Background:** a new `--gradient-services: linear-gradient(180deg, #fef9f0, #f3eef8)` token in `tokens.css`, with a `BlurShape`.

Rejected: `cream-warm` (`#fefcf5`). It is ~0.5% lighter than `cream` — imperceptible against the Builds section directly above — and throughout this codebase `cream-warm` means *card surface* (`BuildCard`, `ImpactStrip`, off-the-clock items, `StatusPill`'s `wip`), never a section background. Every existing section uses `bg-cream` or a dedicated `--gradient-*` token. A new gradient keeps that pattern and does useful work: it walks cream → lavender-wash, so it also sets up `--gradient-career` immediately below.

## 8. Components and data

Follows the `BuildsSection` / `BuildCard` split **architecturally** — a section shell that maps over content data into a per-item component. It does **not** follow it visually: `BuildsSection` renders a `grid grid-cols-1 md:grid-cols-3` of cards, and §7 explicitly rejects a card grid for this section.

- **`src/components/SkillsSection.astro`** — section shell, `id="what-i-do"` (required; it is the anchor target for the hero CTA and the nav link), `SectionHeader`, `BlurShape`, `ScrollFadeIn`, maps rows.
- **`src/components/ServiceRow.astro`** — one row. Props: `{ service, index }`.
- **`src/content/services.ts`** — the four entries above.
- **`ServiceSchema`** added to `src/content/schema.ts`:

```ts
export const ServiceSchema = z.object({
  slug: z.enum(['ship', 'integrate', 'lead', 'enable']),
  title: z.string().min(1),
  description: z.string().min(1),
  statValue: z.string().min(1),
  statCaption: z.string().min(1),
  tags: z.array(z.string().min(1)).length(3),
});
```

`.length(3)` rather than `.min(1)`: every row in §7 carries exactly three tags, and `OffKeyboardSchema` already uses `.length(3)` for its analogous fixed-count `stats` field. Matching that keeps schema style consistent and makes a dropped tag a test failure rather than a silent layout shift.

**Tag rendering** (shared by service rows and build cards, which have no existing precedent — `StatusPill` is a different, single-value component): pill chips, `1px` mint border, transparent background, `JetBrains Mono` uppercase at ~9.5px with `0.7px` letter-spacing, `border-radius: 999px`, `5px 8px` padding. Not comma-separated text. Extract as `src/components/Tag.astro` so the two consumers cannot drift.

**Accessibility:** each stat renders as a `<dl>` with `<dt>` caption and `<dd>` value, so a screen reader announces "time-to-resolve, teams I led: 20 days to 9" rather than a naked "20d → 9d". The `→` in stat values is decorative within a labelled pair; write values as `20 days → 9` rather than `20d → 9d` so the text reads correctly when spoken.

## 9. Supporting edits

**Hero** (`Hero.astro`) — subhead gains a final clause naming availability, echoing the contact section's existing phrasing so the two read as one voice:

> Engineering manager at Gusto. Independent builder of a layoff calculator, a jiu-jitsu app, and a tap-and-knock game for my kids. **And yes, I'm taking contract work.**

Secondary CTA retargets from `#say-hi` to `#what-i-do` and its label changes from "Say hi" to "What I can do →". Primary CTA ("See the builds →") unchanged. "Say hi" remains reachable from the nav button, which is always visible.

**Build cards** (`BuildCard.astro`, `builds.ts`, `BuildSchema`) — add `stack: z.array(z.string().min(1)).min(1)`.

The values exist today in the case-study MDX frontmatter, but **as a single `·`-joined string inside the `stats` array** (`stats[1].value`), under the label `STACK` for severance and rollcall and `BUILT WITH` for knock-it-off. There is no `stack` field anywhere yet.

Author them as explicit arrays in `builds.ts` — do not split the existing string at runtime, and do not make `builds.ts` read the MDX frontmatter:

- severance → `['Next.js', 'TypeScript', 'Supabase']`
- rollcall → `['Next.js', 'Supabase', 'Playwright']`
- knock-it-off → `['Godot 4.6', 'GDScript']`

This duplicates the values across `builds.ts` and the MDX frontmatter. That is accepted: they are two presentations with different lifetimes, and the case-study `stats` block also carries non-stack rows. If they drift, `builds.ts` is authoritative for the homepage.

Rendered as small mono tags on the card.

**Say hi** (`ContactSection.astro`) — the existing "Yes I take contract work. Tell me what you're building." expands to name the four lanes:

> Yes I take contract work — shipping a product end to end, wiring up integrations, running your engineering team, or getting the team you have moving faster. Tell me what you're building.

The section is not moved; it is reached earlier via two new anchors (hero CTA, skills section footer).

**Nav** (`Nav.astro`) — add "What I do", anchored to `#what-i-do`. This makes a fourth link in a bar whose links are already `hidden sm:inline`. If it crowds at `sm`, **drop the Career link from the nav** rather than moving it to the footer: `Footer.astro` currently contains only a copyright line and a build tag, with no nav links at all, so "move it to the footer" would mean designing a footer nav — a larger change than this spec should carry. Career stays reachable from its own section and from `/career`.

**Section renumbering (mandatory, not automatic).** Every section number is a hardcoded literal. Inserting § 02 requires all four of these edits, or the page ships with two `02`s, two `03`s and two `04`s:

| File | Line | From | To |
|---|---|---|---|
| `CareerSection.astro` | 11 | `number="02"` | `number="03"` |
| `OffKeyboardSection.astro` | 10 | `number="03"` | `number="04"` |
| `OffTheClockSection.astro` | 9 | `number="04"` | `number="05"` |
| `ContactSection.astro` | 9 | literal `05 / say hi` | literal `06 / say hi` |

Note that `ContactSection` does **not** use `SectionHeader` — it hand-rolls its header markup and has no `Squiggle`. That is a pre-existing inconsistency. Do not fix it here; just edit the literal. `BuildsSection` keeps `01`.

## 10. Testing

**Automated** — in `src/content/__tests__/content.test.ts`, matching the existing pattern exactly (`z.array(Schema).parse(...)` plus a length and slug assertion):

- `ServiceSchema`: exactly 4 services; slugs equal `['ship', 'integrate', 'lead', 'enable']`; every field non-empty; exactly 3 tags each.
- `BuildSchema` extended to require `stack`; existing builds assertion updated so all three entries carry one.

**No component-rendering test.** The suite has no DOM-rendering capability — every existing test is a pure data/schema check, and `src/lib/__tests__/sanity.test.ts` is a `1 + 1 === 2` placeholder. Playwright is present as a devDependency but is wired only to the screenshot scripts (`scripts/screenshot-products.mjs`, `scripts/og-image.mjs`), not to `vitest run`. Introducing render testing is out of scope for this change; do not add a test that silently requires it.

**Manual, before merge** — these cover what the data tests cannot:

1. `#what-i-do` resolves from both the hero CTA and the nav link.
2. Section numbers read 01–06 once each down the page (the §9 renumbering is the easiest thing here to get wrong).
3. Row columns align across all four rows at desktop width, and stack cleanly below 820px.
4. The four `<dl>` stats announce as label-plus-value in VoiceOver, not as bare glyphs.
5. Re-measure Lighthouse against `npm run preview`; record the result in the README table. Do not assume the 99/95/100/100 baseline holds — accessibility in particular is at 95, and this change adds four new `<dl>` structures and two new tag clusters.

No new client-side JavaScript. `ScrollFadeIn` is reused, not duplicated.

## 11. Assumptions carried into implementation

1. **"built alone"** (lane 01) asserts the Layoff Calculator, Rollcall, and Knock It Off were all genuinely solo. Raised twice during design and not corrected, so it is written as stated — but it is a factual claim about authorship on a page selling work, and it should be confirmed before merge. If anyone else contributed to any of the three, the stat caption changes.
2. **Metric accuracy** — see §5. The two homepage-facing Gusto numbers rest on Tara's recollection, not on data in this repo.
3. **Lane 02's integration partners** (QuickBooks, Xero, Sage Intacct) are sourced from `career.astro:41` and are therefore as reliable as that prose. They name real products publicly associated with Gusto Pro; if any of those integrations is not something Tara's teams actually built or owned, the tags must change. This replaced an invented `Rails` tag — see §7.

## 11a. Review history

This spec was reviewed by two independent read-only reviewers on models other than the author's, per the repository owner's standing rules.

A mechanical fact-check found three false claims about the existing codebase (a non-existent `kicker` prop on `SectionHeader`, an imprecise claim about where the contract line sits on the page, and an omitted Marquee section) and one shape mismatch (build stack values are a `·`-joined string in a `stats` array, not a `stack` field). All are corrected above.

A design review found two blocking defects — §7's `20d → 9d` contradicting §8's own accessibility rule, and the section renumbering being asserted without the four hardcoded edits it requires — plus the unsupported `Rails` tag, a `cream-warm` background that misused a card-surface token, two unwritten copy placeholders, and a test requiring rendering infrastructure this project does not have. All are corrected above. Its voice finding was partly rejected, with reasoning recorded in §7.

The `Rails` tag is worth noting as a pattern: §5 was written specifically to stop unsupportable claims reaching a page that sells work, and an unsupportable claim was then introduced two sections later, in the row most exposed to technical scrutiny. Apply §5's standard to tags and copy, not only to metrics.

## 12. Out of scope

- Redesigning the `/career` subpage.
- Any change to the `/hi` digital business card, which has its own Builder · Consultant · Freelancer framing.
- A rates page, availability calendar, or intake form. The contact form stays as-is.
- Case-study pages for anything other than the three existing builds.
