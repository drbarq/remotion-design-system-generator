import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, useFonts } from "../themes/context";
import { onSurface, onSurfaceMuted, surfaceShadow } from "../themes/contrast";
import { enter, rise } from "../motion";

interface KeyTermChipProps {
  term: string;
  definition: string;
}

// Two-tier conceptual overlay (~1/3 of the canvas): a prominent master term over
// a surface plate with an accent marker, and a smaller definition layer beneath.
export const KeyTermChip: React.FC<KeyTermChipProps> = ({
  term,
  definition,
}) => {
  const theme = useTheme();
  const fonts = useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "crisp");

  const glow = surfaceShadow(theme);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "6%",
          width: "62%",
          backgroundColor: theme.palette.surface,
          borderLeft: `8px solid ${theme.palette.accent}`,
          borderRadius: theme.spatial.radius,
          padding: theme.spatial.padding * 2,
          boxShadow: glow === "none" ? "0 24px 50px rgba(0,0,0,0.35)" : glow,
          opacity: p,
          transform: rise(p, 40),
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: theme.typography.scale.hero * 0.6,
            fontWeight: 700,
            color: theme.palette.accent,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1.0,
            marginBottom: 16,
          }}
        >
          {term}
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: theme.typography.scale.subhead ?? theme.typography.scale.headline,
            fontWeight: 500,
            color: onSurfaceMuted(theme),
            lineHeight: 1.35,
          }}
        >
          {definition}
        </div>
      </div>
    </AbsoluteFill>
  );
};
