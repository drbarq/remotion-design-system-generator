import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, useFonts } from "../themes/context";
import { onSurface } from "../themes/contrast";
import { enter } from "../motion";

interface LowerThirdProps {
  title: string;
  handle?: string; // link / @handle
}

// Structural tracking component for contextual text callouts (links/handles).
// Anchored to the lower third, wipes in from the left on an accent bar.
// Large variant: ~65% width, ~3x the original single-line plate height.
export const LowerThird: React.FC<LowerThirdProps> = ({ title, handle }) => {
  const theme = useTheme();
  const fonts = useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "snappy");
  const wipe = interpolate(p, [0, 1], [-120, 0]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "6%",
          width: "65%",
          display: "flex",
          alignItems: "stretch",
          transform: `translateX(${wipe}px)`,
          opacity: p,
        }}
      >
        <div
          style={{
            width: 18,
            flexShrink: 0,
            backgroundColor: theme.palette.accent,
            borderTopLeftRadius: theme.spatial.radius,
            borderBottomLeftRadius: theme.spatial.radius,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 270, // ~3x the original single-line plate height
            backgroundColor: theme.palette.surface,
            padding: `${theme.spatial.padding * 2}px ${theme.spatial.padding * 2.5}px`,
            borderTopRightRadius: theme.spatial.radius,
            borderBottomRightRadius: theme.spatial.radius,
          }}
        >
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: theme.typography.scale.hero * 0.8,
              fontWeight: 700,
              color: onSurface(theme),
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {handle ? (
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: theme.typography.scale.headline,
                color: theme.palette.accent,
                marginTop: 14,
              }}
            >
              {handle}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
