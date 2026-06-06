# remstyle — image-driven design systems for Remotion

Turn a reference image into a **themed, owned Remotion component kit**. Feed a
design a look (palette, type, spacing, texture); get back overlay components
skinned to match it — and the prompts to generate assets that match too.

This repo is a **working proof of that idea**. The component kit is real and
renders today; you can swap between four designs and see every overlay re-skin.

> Vision/spec docs: [`PRD-remstyle.md`](PRD-remstyle.md) (the standalone tool),
> [`prd.md`](prd.md) (pipeline-integration vision), [`styles.md`](styles.md)
> (the locked-component spec). This README describes **what is actually built.**

---

## The two things this project does

**1. Skin a component kit from a design token file.**
Five locked overlay components (`TitleCard`, `MediaFrame`, `KeyTermChip`,
`TextOverlay`, `LowerThird`/`StepBadge`) read their style from a swappable theme.
Point them at a different theme → the whole kit re-skins. Colors, fonts, radius,
spacing, shadow/glow. Text contrast auto-adjusts (WCAG) so light *and* dark
themes stay legible.

**2. Generate theme-matched assets.**
Each design ships an `image_gen.ts` that turns a concept into a text-to-image
prompt colored from that theme's tokens — so a generated screenshot inside a
`MediaFrame` matches the design instead of clashing.

---

## Layout

```
designs/                      # the catalog — source of truth (1 folder per design)
  <name>/
    theme.ts                  #   design tokens (VideoTheme)
    image_gen.ts              #   concept -> theme-colored image prompt
    <name>.png                #   the reference style frame
  apple_vercel.md             #   (stray hand-written prompt; not wired in)

remotion/                     # the Remotion project (the kit + tooling)
  src/
    components/*.tsx          #   the 5 locked overlay components
    themes/
      registry.ts             #   imports designs/*/theme.ts -> one themes map
      types.ts                #   canonical VideoTheme contract (optional fields)
      context.tsx             #   ThemeProvider / useTheme() / useFonts()
      contrast.ts             #   WCAG luminance resolver (legible text per theme)
    fonts.ts                  #   loads every catalog font, label -> family
    motion.ts                 #   image-INDEPENDENT motion vocabulary (springs)
    registry.tsx              #   component registry (manifest type -> component)
    OverlayManager.tsx        #   manifest-driven router (Sequence per overlay)
    Root.tsx                  #   one Studio folder per theme x overlay + Timeline
    specs/E0X-manifest.json   #   the compiled overlay timeline + asset cues
  scripts/gen-asset-prompts.ts#   the asset-prompt runner
  out/                        #   rendered stills, contact sheets, videos
  README.md                   #   detailed usage (start here to run things)
```

The four designs: **Industrial Developer** (dark/tan/orange), **Vercel Apple
Minimalist** (light/blue), **Stripe Neon Tokyo** (`blade_runner`, neon glow),
**Academic Editorial** (`notion-ish`, paper/sage/serif).

> Two files are named "registry": `src/registry.tsx` maps manifest entry types to
> components; `src/themes/registry.ts` maps theme ids to design tokens. Different
> jobs, different folders.

---

## Quick start

```bash
cd remotion
npm install

npm run studio          # live preview — one folder per theme, every overlay

# see everything without running anything:
open out/themes/all-themes.png      # master grid (overlay x theme)

# render
npx remotion render src/index.ts "blade-runner--Timeline" out.mp4
npx remotion still  src/index.ts "notion-ish--KeyTermChip" out.png --frame=60

# generate theme-matched asset prompts
npm run prompts -- industrial_developer
npm run prompts -- notion_ish "a 3-step onboarding flow"
```

See [`remotion/README.md`](remotion/README.md) for the full workflow, how to add a
design or font, and where to change what.

---

## The core design commitment

A still image carries the **look**, not the **motion**. So the image governs the
static skin (tokens in `designs/*/theme.ts`); a hand-tuned, image-independent
motion vocabulary (`src/motion.ts`) governs how things move. Most design-to-code
tools fail by trying to infer everything from pixels — this one refuses to.
