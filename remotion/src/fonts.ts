// Per-theme font loading. Themes reference fonts by their human label
// ("JetBrains Mono", "Fira Code", "Orbitron", ...). We load every family used
// across the catalog and map label -> actually-loaded CSS family name.
//
// Bare `fontFamily: 'Orbitron'` does NOT load anything in a headless render —
// Chrome has no system fonts and silently falls back. So an UNMAPPED label is a
// real bug; we make it loud instead of letting it fall back silently.
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadOrbitron } from "@remotion/google-fonts/Orbitron";
import type { VideoTheme } from "./themes/types";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"], ignoreTooManyRequestsWarning: true });
const jetBrains = loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"], ignoreTooManyRequestsWarning: true });
const firaCode = loadFiraCode("normal", { weights: ["400", "500"], subsets: ["latin"], ignoreTooManyRequestsWarning: true });
const lora = loadLora("normal", { weights: ["400", "500", "700"], subsets: ["latin"], ignoreTooManyRequestsWarning: true });
const orbitron = loadOrbitron("normal", { weights: ["400", "700", "900"], subsets: ["latin"], ignoreTooManyRequestsWarning: true });

// label (as written in the theme token files) -> loaded CSS family
const FAMILY_MAP: Record<string, string> = {
  Inter: inter.fontFamily,
  "JetBrains Mono": jetBrains.fontFamily,
  "Fira Code": firaCode.fontFamily,
  Lora: lora.fontFamily,
  Orbitron: orbitron.fontFamily,
};

const resolve = (label: string | undefined, fallback: string): string => {
  if (!label) return fallback;
  const mapped = FAMILY_MAP[label];
  if (!mapped) {
    // Loud, not silent — a missing mapping means the render will look wrong.
    console.error(
      `[remstyle] font "${label}" is not loaded. Add it to src/fonts.ts. Falling back to ${fallback}.`
    );
    return fallback;
  }
  return mapped;
};

export interface ThemeFonts {
  sans: string;
  mono: string;
  serif: string; // falls back to sans when the theme has no serif
}

export const themeFonts = (theme: VideoTheme): ThemeFonts => {
  const sans = resolve(theme.typography.sans, inter.fontFamily);
  return {
    sans,
    mono: resolve(theme.typography.mono, jetBrains.fontFamily),
    serif: resolve(theme.typography.serif, sans),
  };
};
