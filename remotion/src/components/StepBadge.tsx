import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, useFonts } from "../themes/context";
import { bestText, surfaceShadow } from "../themes/contrast";
import { enter, plateCompress } from "../motion";

interface StepBadgeProps {
  step: number;
  label: string;
}

// Sequential process indicator (Step 1, Step 2...). The index sits in an accent
// chip; the label rides alongside on a contrasting plate.
export const StepBadge: React.FC<StepBadgeProps> = ({ step, label }) => {
  const theme = useTheme();
  const fonts = useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "snappy");

  const onAccent = bestText(theme.palette.accent, [
    theme.palette.bg,
    theme.palette.fg,
  ]);
  const onPlate = bestText(theme.palette.border, [
    theme.palette.fg,
    theme.palette.bg,
  ]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spatial.padding,
          opacity: p,
          transform: plateCompress(p),
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: theme.typography.scale.hero,
            fontWeight: 700,
            color: onAccent,
            backgroundColor: theme.palette.accent,
            borderRadius: theme.spatial.radius,
            padding: `${theme.spatial.padding * 0.5}px ${theme.spatial.padding * 1.5}px`,
            lineHeight: 1.1,
            boxShadow: surfaceShadow(theme),
          }}
        >
          {step}
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: theme.typography.scale.hero * 0.5,
            fontWeight: 700,
            color: onPlate,
            backgroundColor: theme.palette.border,
            borderRadius: theme.spatial.radius,
            padding: `${theme.spatial.padding}px ${theme.spatial.padding * 1.5}px`,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
