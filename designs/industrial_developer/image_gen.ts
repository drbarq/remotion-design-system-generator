import { VideoTheme } from "./theme";

export function generateAssetPrompt(
  theme: VideoTheme,
  concept: string,
): string {
  // Map elevation to prompt descriptors
  const shadowText =
    (theme.spatial.elevation as string) === "shadow"
      ? "soft diffused drop shadows"
      : "no shadows, flat high-contrast layout";

  return `A highly polished whiteboard explainer diagram showing ${concept}, structured for a UI component overlay. 
Background color is exactly a solid flat block of ${theme.palette.surface}. 
Diagram architectural nodes and text callouts use clean, precise lines in ${theme.palette.fgMuted}. 
The primary data path, highlights, and accent arrows are vividly colored in ${theme.palette.accent}. 
Spatial traits: ${theme.spatial.radius}px rounded corner geometry, mathematically balanced grid layout, ${shadowText}, no clutter, vector UI/UX illustration style. --ar 16:9 --style raw`;
}
