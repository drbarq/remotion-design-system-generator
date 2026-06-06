# PRD — `remstyle`

*Working title (provisional). A standalone tool that turns a reference image into a themed Remotion component kit.*

**Status:** Draft for a new, separate project. Not part of the Claude 101/201 pipeline.
**Author:** Joe Tustin
**Date:** 2026-06-06

---

## 1. One-line

Feed it an image of a style; get back a Remotion component kit skinned to match that style — color, type, spacing, texture — that you own and can drop into any Remotion project.

## 2. Problem

Remotion has no batteries-included visual identity. Two existing options, both unsatisfying:

- **Build every overlay from scratch** — slow, and the look drifts across a series.
- **Adopt a fixed catalog (remocn etc.)** — fast, but everyone's videos end up looking the same, and the catalog's aesthetic is the catalog's, not yours.

The missing middle: *a way to get a consistent, custom look without hand-tuning theme tokens for every project.* Designers think in references ("make it feel like this frame"), not in hex codes and spring constants. Today there's no path from a reference frame to working Remotion code.

## 3. Key insight (the seam the whole product is built on)

**A still image carries the *look*, not the *motion*.**

From one frame you can reliably extract: palette, type feel, spatial language (density, radius, border-vs-shadow, grid), texture/mood. You *cannot* extract timing, easing, or spring physics — motion is not a property of a frame.

So the product splits cleanly along that seam:

> **The reference image governs the static skin. A curated, image-independent motion vocabulary governs how things move.**

This is the core architectural commitment. It keeps the hard, ambiguous part (motion taste) as a stable, hand-tuned asset, and reduces the image's job to the part it can actually do well (static design tokens). Most "design-to-code" tools fail by trying to infer everything from the pixels; `remstyle` refuses to.

## 4. Goals / Non-goals

**Goals**
- Image → a stable, typed **design-token set** (palette, typography, spatial, texture).
- A **component kit** parameterized *only* by tokens + motion presets, so re-skinning = swapping a token file.
- **Copy-paste ownership** (shadcn philosophy): output lands in the user's repo, no runtime dep, no lock-in.
- A **CLI** that does the whole loop: `image in → tokens + components out → preview in Remotion Studio`.
- An optional **constraints profile** so opinionated users (e.g. "PIP only, restraint-by-default") can bound the output.

**Non-goals (v1)**
- Inferring motion from a still image. (Out by definition — see §3.)
- A hosted catalog of pre-built scenes. That's remocn's game; `remstyle` competes on *your look*, not a fixed look.
- Inferring motion from a *reference video* — interesting, but a later epic (§10).
- Full Tailwind/shadcn-registry integration. v1 emits plain Remotion + inline-token styling. (Revisit if demand exists.)
- Auto-placement / editorial judgment about *when* an overlay should appear. The kit produces components; the user composes them.

## 5. Users & use cases

- **Solo video builder / one-operator series** — wants a recognizable house style across many episodes without re-tuning theme tokens each time. *Primary.*
- **Small team shipping demo/launch videos** — has a brand board or a design mock and wants Remotion components that match it.
- **Designer-to-developer handoff** — designer supplies a frame; the tool gives the developer a faithful token starting point instead of eyeballed hex codes.

**Representative flow:** "Here's a screenshot of the look I want. Give me a title card, a lower-third, a key-term chip, and a numbered callout that match it, animated tastefully, that I can edit."

## 6. Architecture

Five parts, along the seam from §3.

### 6.1 Style extractor (image → tokens)
- **Input:** one image (v1). PNG/JPG.
- **Hybrid extraction:**
  - *Deterministic:* real pixel work for the things math does better than a model — palette via color quantization (k-means / median-cut), dominant-vs-accent ranking, background luminance, contrast checks.
  - *Vision-model:* the judgment calls — serif vs grotesk vs mono, weight/tightness, corner radius, border-vs-shadow, texture (flat / grain / glass / vignette), mood descriptors.
- **Output:** a `tokens.json` conforming to the schema (§7), plus a `provenance` block noting, per token, whether it was **measured** (from pixels), **inferred** (model), or **defaulted** (gap-filled). Honesty about confidence is a feature — see §9.

### 6.2 Token schema (the contract)
A stable, versioned typed shape that every component consumes. Components never hardcode style; they read tokens. (Schema sketch in §7.)

### 6.3 Motion vocabulary (image-independent)
A curated, hand-tuned library of spring presets (snappy / crisp / subtle / heavy) and easing curves (enter / exit / draw), plus a small set of motion *primitives* (fade, rise, draw-on, plate-compress). Shipped with the tool, **not derived from the image.** This is where taste lives.

### 6.4 Component kit
A small set of Remotion components, each parameterized by `(tokens, motionPreset)`:
- `TitleCard`
- `LowerThird`
- `KeyTermChip`
- `NumberedCallout`
- `QuoteHold`
- (kit grows over time; v1 ships ~5)

Re-skinning the whole kit = pointing it at a different `tokens.json`. That's the payoff of §6.2.

### 6.5 Generator / CLI
Orchestrates the loop and writes files into the target project (copy-paste, owned). See §8.

```
image.png ──▶ [extractor] ──▶ tokens.json ──┐
                                            ├──▶ [generator] ──▶ theme.ts + components/*.tsx
        motion vocabulary (built-in) ───────┘                          │
                                                                       ▼
                                                            Remotion Studio preview
```

## 7. Data contract — token schema (sketch)

```jsonc
{
  "version": 1,
  "palette": {
    "bg":      { "value": "#0E1014", "source": "measured" },
    "surface": { "value": "#161A20", "source": "measured" },
    "border":  { "value": "#22262C", "source": "inferred" },
    "fg":      { "value": "#F5F2EC", "source": "measured" },
    "fgMuted": { "value": "#9CA0A8", "source": "inferred" },
    "accent":  { "value": "#D4A24C", "source": "measured" },
    "warn":    { "value": "#C75450", "source": "defaulted" }
  },
  "typography": {
    "sans":  { "family": "Geist",         "weights": [400,500,600], "source": "inferred" },
    "mono":  { "family": "JetBrains Mono", "weights": [400,500],     "source": "inferred" },
    "scale": { "hero": 64, "display": 48, "headline": 32, "body": 20, "caption": 16 }
  },
  "spatial": {
    "radius": 8, "borderWidth": 1, "elevation": "border",  // border | shadow
    "density": "tight"  // tight | comfortable | airy
  },
  "texture": {
    "grain": 0.04, "vignette": 0.2, "glass": false
  }
}
```

Design rules:
- Schema is **versioned** so components can migrate.
- Every token carries a `source` so the user knows what's real.
- Font *family* is a best-guess label, not a guarantee — extractor maps to nearest available `@remotion/google-fonts` family and flags the substitution.

## 8. CLI / UX

```bash
# one-shot: image → tokens + components into ./remstyle-out
npx remstyle from-image ./style.png

# extract tokens only (review before generating)
npx remstyle extract ./style.png -o tokens.json

# generate components from a (possibly hand-edited) token file
npx remstyle generate --tokens tokens.json --out ./src/components

# constrain the output
npx remstyle from-image ./style.png --profile restraint-pip
```

- **Review gate by default:** `from-image` prints the token set with `source` flags and a confidence summary, and waits for confirmation before writing components. The user edits `tokens.json` and re-runs `generate`. (Avoids "magic that's subtly wrong.")
- **Output is owned code.** No runtime dependency on `remstyle`.
- **Preview:** a bundled minimal Remotion project so the user sees the kit on the extracted tokens immediately.

## 9. Honesty / confidence (a first-class feature)

The single biggest failure mode of design-to-code is *confidently wrong output.* `remstyle` counters it:
- Every token tagged `measured` / `inferred` / `defaulted`.
- A post-extract summary: "Palette measured from pixels. Type families inferred — verify. Motion not derived from image; using `restraint` preset."
- The tool states plainly what was *in the image* vs. what it *filled in.* This is the trust mechanism.

## 10. MVP scope & milestones

**MVP (prove the seam holds)**
1. Extractor: deterministic palette + vision-model type/texture → `tokens.json` with `source` flags.
2. Token schema v1.
3. Motion vocabulary v1 (the presets above).
4. ~5 components reading tokens + motion.
5. CLI: `extract`, `generate`, `from-image`; bundled preview.
6. One constraints profile: `restraint-pip`.

**Success bar for MVP:** hand it 3 reference images of genuinely different styles; the generated kit is recognizably each style and editable to "right" in under 15 minutes — beating from-scratch.

**Later epics**
- Brand board / multi-image input (reconcile several frames into one token set).
- Motion-from-reference-*video* (the other half of the seam — extract timing/easing from clips).
- Tailwind/shadcn-registry output mode.
- Larger component kit; user-contributed components.
- Web playground (upload image → live preview, like remocn.dev).

## 11. Risks & open questions

- **Type-family identification is hard** from a single frame. Mitigate: map to nearest available family, flag the substitution, never claim certainty.
- **"Style" is more than tokens.** Some looks are carried by illustration, photography, or bespoke layout that tokens can't capture. Scope `remstyle` to *systematizable* style; say so.
- **Does the seam actually hold?** The whole bet is that static-skin + canned-motion reads as "matching the reference." Validate early with the §10 success bar before building the full kit.
- **Vision-model dependency** — which model, cost per extraction, offline story? (Open.)
- **Positioning vs remocn** — complement, not competitor: remocn = a fixed great look; `remstyle` = *your* look. Could even emit into a remocn-compatible structure later. (Open.)
- **Naming** — `remstyle` is provisional.

## 12. What this explicitly is *not*

It is not an editorial/judgment tool. It does not decide when an overlay belongs, keep a presenter on screen, or enforce a series' restraint rules — those are operator decisions (and, for the 101/201 pipeline, already handled there). `remstyle` produces a faithful, owned, themed component kit from a reference. Composition stays with the human.
