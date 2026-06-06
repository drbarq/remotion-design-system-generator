# remstyle demo — multi-theme Remotion component kit

A working slice of the `remstyle` output: a set of locked overlay components that
are **skinned entirely by a swappable design token file**. Drop in a different
design and the whole kit re-skins — colors, fonts, radius, spacing, shadows/glow.

Four designs ship in `/designs` (each is a remstyle artifact: `*.ts` tokens +
`*.png` reference image):

- **Industrial Developer** — dark, Canvas Tan, Utility Orange, Inter / JetBrains Mono
- **Vercel Apple Minimalist** — light, white cards, electric blue, radius 24
- **Stripe Neon Tokyo** (`blade_runner`) — dark purple, magenta/cyan, neon glow, Orbitron / Fira Code
- **Academic Editorial** (`notion-ish`) — paper white, sage, Lora serif headlines

## How a design is "passed in"

Designs live in `/designs`, one folder per design (source of truth):

```
designs/<name>/
  theme.ts      # the design tokens (VideoTheme)
  image_gen.ts  # concept -> theme-colored image prompt
  <name>.png    # the reference style frame
```

The Remotion project **imports** them via a thin registry; nothing is copied, so
re-generating a design is picked up automatically.

- `src/themes/registry.ts` — imports the 4 `/designs/*.ts` files, normalizes their
  differently-named exports into one `themes` record keyed by `ThemeId`.
- `src/themes/types.ts` — the canonical `VideoTheme` contract. Optional fields
  (`typography.serif`, `scale.subhead`, `spatial.neonGlow`) absorb schema drift
  between designs.
- `src/themes/context.tsx` — `ThemeProvider` / `useTheme()` / `useFonts()`. Every
  component reads the active theme from context instead of importing a fixed one.
- `src/themes/contrast.ts` — WCAG luminance resolver. Components never hardcode
  "dark text on a light plate"; `onSurface()` / `onBg()` pick the legible color for
  whatever palette is active, so light and dark themes both stay readable.
- `src/fonts.ts` — loads every family used across the catalog and maps the theme's
  font label → the actually-loaded family. An unmapped label logs loudly (never a
  silent fallback).

## Generating theme-matched assets (the `image_gen` loop)

Each design folder ships an `image_gen.ts` that turns a **concept** into a
text-to-image prompt whose colors come straight from that theme's tokens — so a
generated `MediaFrame` screenshot matches the active design instead of clashing.

The runner reads the manifest's `MediaFrame` cues (each can carry a `concept`)
plus any ad-hoc concepts, and emits ready-to-run prompts mapped to the file you
save them as:

```bash
cd remotion
npm run prompts -- blade_runner                         # prompts for manifest assets
npm run prompts -- notion_ish "a 3-step onboarding flow" # + an ad-hoc concept
```

Output prints to the console and writes `out/asset-prompts-<theme>.md`. The loop:

1. `npm run prompts -- <theme>` → themed prompt + target filename
2. run the prompt in your image generator (Midjourney/etc.)
3. save the PNG to `remotion/public/<file>` (e.g. `burn-rate.png`)
4. `MediaFrame` renders it, already color-matched. No code change.

## View the overlays (no install needed)

Pre-rendered into `out/themes/`:

- `out/themes/all-themes.png` — **master grid: every overlay × every theme**
- `out/themes/_sheet-<theme>.png` — one row per theme
- `out/themes/<theme>--<Overlay>.png` — each overlay, full res
- `out/timeline-industrial.mp4`, `out/timeline-blade-runner.mp4` — showcase videos

```bash
open out/themes/all-themes.png
```

## Tune interactively (live preview)

```bash
cd remotion
npm run studio
```

Studio shows **one folder per theme**, each containing every overlay + the full
`Timeline`. Switch folders to compare a component across designs; edit any file and
it hot-reloads.

## Re-render after edits

Composition ids are `<theme-slug>--<Overlay>` (slug = theme id with `-`):

```bash
cd remotion
npx remotion still   src/index.ts "blade-runner--KeyTermChip" out/themes/blade-runner--KeyTermChip.png --frame=60
npx remotion render  src/index.ts "notion-ish--Timeline"      out/timeline-notion.mp4
```

To re-render all theme × overlay stills + contact sheets, see the loop in the
project notes (zsh arrays; `magick montage` builds the sheets).

## Where to change things

| Want to change… | Edit |
| --- | --- |
| A design's colors / fonts / radius / spacing / glow | `/designs/<name>/theme.ts` (regenerate via remstyle) |
| How theme-matched asset prompts read | `/designs/<name>/image_gen.ts` |
| Add a new design | add `designs/<name>/{theme.ts,image_gen.ts}`, register it in `src/themes/registry.ts` |
| Add a font family | `src/fonts.ts` (import the `@remotion/google-fonts/<Name>` module, add to the map) |
| How things animate | `src/motion.ts` (spring/easing presets — image-independent) |
| A component's layout | `src/components/*.tsx` |
| The demo sequence / timings | `src/specs/E0X-manifest.json` |
| Sample screenshots | `public/burn-rate.png`, `public/mobile-ui.png` |

## The components

1. **TitleCard** — hero chapter break / script hook (serif headline when the theme has one)
2. **MediaFrame** — PIP screenshot wrapper; `vertical` (80% height) vs `landscape` (centered)
3. **KeyTermChip** — term (bound to `palette.accent`) + definition on a surface plate
4. **TextOverlay** — high-impact quote / callout
5. **LowerThird** / **StepBadge** — handle/link tracker, and sequential step indicator

The radial backdrop labeled "footage" (tinted to each theme's bg) is preview-only
scaffolding standing in for your talking-head footage — not part of the shipped kit.

## Note on sample assets

The screenshots inside `MediaFrame` (`public/burn-rate.png`, `mobile-ui.png`) are
fixed placeholder *content*, colored for the Industrial look. The `MediaFrame`
itself (border, radius, plate, shadow/glow) re-skins per theme; the image content
does not. Swap the PNGs for your real assets.
