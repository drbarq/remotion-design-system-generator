# Product Requirements Document (PRD) — `remstyle` Integration Layer

**Status:** Approved for Development  
**Author:** Joe Tustin  
**Date:** June 6, 2026

---

## 1. Executive Summary & Core Concept

The Claude Video Pipeline automates the editorial lifecycle of an educational video series—moving from markdown scripts and raw footage to a polished rough cut via Claude Code skills. This project introduces `remstyle`, an intelligent design-token engine, to automate **Step 7 (`episode-visualize`)**.

Instead of hand-authoring graphic overlay placements and styles, the pipeline will parse script directives (`[SHOW: ...]`), match them to pre-generated episode assets, sync them with Deepgram transcripts, and compile them into themed, responsive Remotion components.

---

## 2. Updated Asset Workflow & Pipeline Lifecycle

The script is the blueprint. To ensure the pipeline never stalls on missing assets, the creation lifecycle must follow this strict sequence:

1. **Lock the Script:** Write the markdown script (`scripts/E0X-*.md`) containing explicit cue markers (e.g., `[SHOW: asset-name]`).
2. **Scaffold & Inventory:** Run `episode-scaffold`. The skill parses the script, builds the `episodes/E0X/` directory, and outputs a checklist of required visual assets.
3. **Asset Generation (Pre-Flight):** Generate or gather the specified assets (via text-to-image APIs, screenshots, or code clips) and drop them into the episode's local assets directory: `episodes/E0X/assets/`.
4. **Record:** Film the talking-head footage and drop it into the recordings folder.
5. **Compile (Steps 3–8):** Run transcription, chopping, rendering, and refinement. When `episode-visualize` runs, every asset it needs is already sitting in the local folder, ready to be synced to the timeline and skinned.

---

## 3. Detailed Component Specifications

### 3.1 Episode-Isolated Styling (`episode-theme`)

- **Scope:** Styles are isolated at the individual episode level. The skill reads a reference style frame dropped directly into the episode folder: `episodes/E0X/style.png`.
- **The `remstyle` Extraction:**
  - **Deterministic Tones:** Performs k-means clustering on the local image to extract background, surface, text, and accent colors, forcing WCAG text contrast legibility adjustments if boundaries fail.
  - **Visual Language Mapping:** Inspects the frame for spacing density, border widths, corner radius (`spatial.radius`), and maps typographic weights to the nearest available `@remotion/google-fonts` token.
  - **Output:** Writes a local `remotion/specs/E0X-theme.ts` file that parameters the layout styles.

### 3.2 Dynamic Picture-in-Picture (PIP) Layout Engine

Every graphical overlay component sitting over the talking-head footage is structured as a parameterized, responsive Picture-in-Picture (PIP) panel. The layout engine evaluates the aspect ratio of the asset file inside `episodes/E0X/assets/` and applies the following layout transformations:

| Asset Aspect Ratio                                                 | Screen Coverage                                     | Layout Bounds & Composition                                                                                       |
| :----------------------------------------------------------------- | :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Portrait / Vertical** <br>_(Mobile UI screenshots, code blocks)_ | **70% to 90%** of screen height                     | Centered vertically, maximized scale. Bound by the `spatial.radius` and `palette.border` extracted by `remstyle`. |
| **Landscape / Horizontal** <br>_(Desktop app UI, wide code panes)_ | Restricted scale _(Will never take up full screen)_ | Positioned dead-center or anchored cleanly to the lower third of the canvas.                                      |

### 3.3 The Automated Alignment Pass (`episode-visualize`)

- **Timestamp Matching:** Maps `[SHOW: asset-name]` text boundaries to the corresponding timestamp array generated during Deepgram transcription.
- **Execution:** Spawns the required overlay component (`CodeHold`, `BrowserWindow`, or `KeyTermChip`), injects the pre-generated asset, wraps it in the `remstyle` border/shadow parameters, and overlays it seamlessly onto the timeline.

---

## 4. Engineering Milestones & Deliverables

- **Milestone 1:** Build the `remstyle` style extractor CLI (`image -> tokens.json`) using templates in `remotion/src/`.
- **Milestone 2:** Implement the layout aspect-ratio switcher (Vertical vs. Landscape PIP frames).
- **Milestone 3:** Update the `episode-scaffold` and `episode-visualize` skills to parse, check for, and align local `episodes/E0X/assets/` directly to transcript timestamps.
