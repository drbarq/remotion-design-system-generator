import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, useFonts } from "../themes/context";
import { onBg } from "../themes/contrast";
import { enter, rise } from "../motion";

interface TitleCardProps {
  eyebrow?: string;
  title: string;
}

// Large-scale hero canvas for chapter breaks and script hooks. Inherits massive
// font scaling and the core background tone. Headlines use the theme serif when
// it has one, otherwise the sans.
export const TitleCard: React.FC<TitleCardProps> = ({ eyebrow, title }) => {
  const theme = useTheme();
  const fonts = useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "crisp");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.palette.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 8%",
      }}
    >
      <div style={{ opacity: p, transform: rise(p, 60) }}>
        {eyebrow ? (
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: theme.typography.scale.headline,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: theme.palette.accent,
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: theme.typography.scale.hero,
            fontWeight: 700,
            lineHeight: 1.02,
            color: onBg(theme),
            maxWidth: "14ch",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 40,
            width: 160,
            height: 8,
            borderRadius: theme.spatial.radius,
            backgroundColor: theme.palette.accent,
            transform: `scaleX(${p})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
