/**
 * Asset-prompt generator — the bridge from a theme to themed image prompts.
 *
 *   npx tsx scripts/gen-asset-prompts.ts <themeId> ["extra concept" ...]
 *
 * For the chosen theme it:
 *   1. reads the manifest, finds every MediaFrame cue (with its `concept`),
 *   2. asks that theme's own image_gen.ts to build a color-matched prompt,
 *   3. prints a checklist mapping each prompt -> the file you save it as,
 *   4. writes the same to out/asset-prompts-<themeId>.md.
 *
 * Run the prompts in your image generator, save each PNG to public/<src>, and
 * MediaFrame renders it already matching the design. No code changes needed.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Each design owns its tokens + prompt generator (the catalog in /designs).
import { industrial_developer_theme } from "../../designs/industrial_developer/theme";
import { generateAssetPrompt as genIndustrial } from "../../designs/industrial_developer/image_gen";
import { apple_vercel_theme } from "../../designs/apple_vercel/theme";
import { generateAssetPrompt as genApple } from "../../designs/apple_vercel/image_gen";
import { blade_runner_theme } from "../../designs/blade_runner/theme";
import { generateAssetPrompt as genBlade } from "../../designs/blade_runner/image_gen";
import { notion_ish_theme } from "../../designs/notion-ish/theme";
import { generateAssetPrompt as genNotion } from "../../designs/notion-ish/image_gen";

import manifest from "../src/specs/E0X-manifest.json";

type Design = {
  label: string;
  theme: any;
  gen: (theme: any, concept: string) => string;
};

const DESIGNS: Record<string, Design> = {
  industrial_developer: {
    label: industrial_developer_theme.themeName,
    theme: industrial_developer_theme,
    gen: genIndustrial,
  },
  apple_vercel: {
    label: apple_vercel_theme.themeName,
    theme: apple_vercel_theme,
    gen: genApple,
  },
  blade_runner: {
    label: blade_runner_theme.themeName,
    theme: blade_runner_theme,
    gen: genBlade,
  },
  notion_ish: {
    label: notion_ish_theme.themeName,
    theme: notion_ish_theme,
    gen: genNotion,
  },
};

const themeId = process.argv[2] ?? "industrial_developer";
const extraConcepts = process.argv.slice(3);
const design = DESIGNS[themeId];

if (!design) {
  console.error(
    `Unknown theme "${themeId}". Options: ${Object.keys(DESIGNS).join(", ")}`
  );
  process.exit(1);
}

interface Job {
  concept: string;
  file: string | null; // target filename in public/, when known
  aspectRatio?: string;
}

// Pull every MediaFrame cue out of the manifest, plus any ad-hoc concepts.
const jobs: Job[] = [];
for (const o of manifest.overlays as any[]) {
  if (o.type === "MediaFrame" && o.concept) {
    jobs.push({
      concept: o.concept,
      file: o.props?.src ?? null,
      aspectRatio: o.props?.aspectRatio,
    });
  }
}
for (const c of extraConcepts) jobs.push({ concept: c, file: null });

if (jobs.length === 0) {
  console.error(
    "No assets to generate. Add `concept` to MediaFrame cues in the manifest, or pass concepts as args."
  );
  process.exit(1);
}

const lines: string[] = [];
lines.push(`# Asset prompts — ${design.label} (\`${themeId}\`)`);
lines.push("");
lines.push(
  `Generate each prompt, then save the PNG to \`remotion/public/<file>\`. MediaFrame will render it matched to this theme.`
);
lines.push("");

jobs.forEach((job, i) => {
  const prompt = design.gen(design.theme, job.concept);
  lines.push(`## ${i + 1}. ${job.concept}`);
  if (job.file) {
    lines.push(`- **Save as:** \`remotion/public/${job.file}\``);
    lines.push(`- **Aspect:** ${job.aspectRatio ?? "n/a"}`);
  } else {
    lines.push(`- **Save as:** _(ad-hoc — pick a filename, reference it from the manifest)_`);
  }
  lines.push("");
  lines.push("```");
  lines.push(prompt.trim());
  lines.push("```");
  lines.push("");
});

const out = lines.join("\n");
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `asset-prompts-${themeId}.md`);
writeFileSync(outPath, out);

console.log(out);
console.error(`\n[written] ${outPath}`);
