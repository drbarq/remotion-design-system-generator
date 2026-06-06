import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme, useFonts } from "../themes/context";
import { onBg, onBgMuted } from "../themes/contrast";
import { enter, rise } from "../motion";

interface TextOverlayProps {
  text: string;
  attribution?: string;
}

// High-impact text callout for highlight slides, quotes, or important notes.
// Decoupled from standard video subtitles. Sits over the bg tone with an accent
// quote mark.
export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  attribution,
}) => {
  const theme = useTheme();
  const fonts = useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "subtle");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.palette.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 8%",
      }}
    >
      <div style={{ opacity: p, transform: rise(p, 50) }}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: theme.typography.scale.hero * 1.6,
            fontWeight: 700,
            color: theme.palette.accent,
            lineHeight: 0.6,
            height: 60,
          }}
        >
          “
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: theme.typography.scale.hero * 0.66,
            fontWeight: 700,
            color: onBg(theme),
            lineHeight: 1.12,
            maxWidth: "18ch",
          }}
        >
          {text}
        </div>
        {attribution ? (
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: theme.typography.scale.headline,
              color: onBgMuted(theme),
              marginTop: 32,
              letterSpacing: "0.04em",
            }}
          >
            — {attribution}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
