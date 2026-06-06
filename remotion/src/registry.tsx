import React from "react";
import { staticFile } from "remotion";
import { TitleCard } from "./components/TitleCard";
import { MediaFrame } from "./components/MediaFrame";
import { KeyTermChip } from "./components/KeyTermChip";
import { TextOverlay } from "./components/TextOverlay";
import { LowerThird } from "./components/LowerThird";
import { StepBadge } from "./components/StepBadge";

// Maps a manifest `type` string to its locked component. The AI engine never
// edits these layouts; it only swaps the theme tokens they read.
export const registry: Record<string, React.FC<any>> = {
  TitleCard,
  MediaFrame,
  KeyTermChip,
  TextOverlay,
  LowerThird,
  StepBadge,
};

// Resolve manifest props into runtime props (e.g. asset paths → staticFile).
export const resolveProps = (type: string, props: Record<string, unknown>) => {
  if (type === "MediaFrame" && typeof props.src === "string") {
    return { ...props, src: staticFile(props.src) };
  }
  return props;
};
