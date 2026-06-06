import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme, useFonts } from "./themes/context";

// Stand-in for the talking-head footage, so transparent overlays
// (KeyTermChip, MediaFrame, LowerThird, StepBadge) are viewable in context
// while you tune them. Not part of the shipped kit — preview scaffolding only.
// Tints to the active theme's background so it reads in light and dark themes.
const shade = (hex: string, amount: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r}, ${g}, ${b})`;
};

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const fonts = useFonts();
  const bg = theme.palette.bg;
  const lifted = shade(bg, 16);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 20%, ${lifted} 0%, ${bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: theme.typography.scale.body,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: shade(bg, 40),
        }}
      >
        footage
      </div>
    </AbsoluteFill>
  );
};
