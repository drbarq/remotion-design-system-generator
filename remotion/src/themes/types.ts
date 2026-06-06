// Canonical theme contract every component consumes. The remstyle-generated
// design files in /designs conform to this; optional fields cover schema drift
// between themes (not every look has a serif, a subhead step, or a glow).
export interface VideoTheme {
  version: number;
  themeName: string;
  palette: {
    bg: string;
    surface: string;
    border: string;
    fg: string;
    fgMuted: string;
    accent: string;
  };
  typography: {
    sans: string;
    mono: string;
    serif?: string;
    scale: {
      hero: number;
      headline: number;
      subhead?: number;
      body: number;
      code: number;
    };
  };
  spatial: {
    radius: number;
    borderWidth: number;
    padding: number;
    elevation: "flat" | "shadow";
    neonGlow?: string; // optional custom box-shadow hook (e.g. blade_runner)
  };
}
