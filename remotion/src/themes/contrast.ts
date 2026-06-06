import type { VideoTheme } from "./types";

// WCAG relative-luminance contrast utilities. Components must not assume the
// Industrial dark-bg/light-surface relationship — on light themes (apple_vercel,
// notion_ish) or dark-surface themes (blade_runner), hardcoding palette.bg as
// "text on a surface" goes invisible. This picks the legible color by contrast.

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const relLuminance = (hex: string): number => {
  const srgb = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

export const contrastRatio = (a: string, b: string): number => {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

/** Best of the candidate colors for legible text on `background`. */
export const bestText = (background: string, candidates: string[]): string => {
  let best = candidates[0];
  let bestRatio = -1;
  for (const c of candidates) {
    const r = contrastRatio(background, c);
    if (r > bestRatio) {
      bestRatio = r;
      best = c;
    }
  }
  // Guarantee legibility even if every token clashes with the surface.
  if (bestRatio < 4.5) {
    const blackR = contrastRatio(background, "#000000");
    const whiteR = contrastRatio(background, "#FFFFFF");
    return blackR > whiteR ? "#000000" : "#FFFFFF";
  }
  return best;
};

/** Legible primary text color to sit on the theme's surface plate. */
export const onSurface = (theme: VideoTheme): string =>
  bestText(theme.palette.surface, [
    theme.palette.fg,
    theme.palette.bg,
    theme.palette.border,
  ]);

/** Legible muted/secondary text color on the surface plate. */
export const onSurfaceMuted = (theme: VideoTheme): string =>
  bestText(theme.palette.surface, [
    theme.palette.fgMuted,
    theme.palette.border,
    theme.palette.bg,
  ]);

/** Legible text color on the theme's background. */
export const onBg = (theme: VideoTheme): string =>
  bestText(theme.palette.bg, [theme.palette.fg, theme.palette.fgMuted]);

export const onBgMuted = (theme: VideoTheme): string =>
  bestText(theme.palette.bg, [theme.palette.fgMuted, theme.palette.border, theme.palette.fg]);

/**
 * Resolved drop-shadow for a surface plate. Honors a theme's custom neonGlow
 * hook first, then the elevation token.
 */
export const surfaceShadow = (theme: VideoTheme): string => {
  if (theme.spatial.neonGlow) return theme.spatial.neonGlow;
  return theme.spatial.elevation === "shadow"
    ? "0 24px 50px rgba(0,0,0,0.35)"
    : "none";
};
