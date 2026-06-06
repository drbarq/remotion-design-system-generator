import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes/context";
import { surfaceShadow } from "../themes/contrast";
import { enter, plateCompress } from "../motion";

interface MediaFrameProps {
  src: string; // Path to a pre-generated asset
  aspectRatio: "vertical" | "landscape";
}

// Responsive PIP wrapper for screenshots/images. Evaluates asset aspect ratio to
// apply the 80%/landscape layout rules, with localized border, corner radius,
// and a background plate for separation. Honors the theme's neonGlow when set.
export const MediaFrame: React.FC<MediaFrameProps> = ({ src, aspectRatio }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, "snappy");

  const imageStyle: React.CSSProperties = {
    borderRadius: theme.spatial.radius,
    border: `${theme.spatial.borderWidth}px solid ${theme.palette.border}`,
    backgroundColor: theme.palette.surface,
    boxShadow: surfaceShadow(theme),
    objectFit: "contain",
    // Layout rules: vertical fills ~80% height; landscape is bound to center.
    height: aspectRatio === "vertical" ? "80%" : "auto",
    width: aspectRatio === "landscape" ? "82%" : "auto",
    maxHeight: "90%",
    maxWidth: "90%",
    padding: theme.spatial.padding,
    opacity: p,
    transform: plateCompress(p),
  };

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img src={src} style={imageStyle} />
    </AbsoluteFill>
  );
};
