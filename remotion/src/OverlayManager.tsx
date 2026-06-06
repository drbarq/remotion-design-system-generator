import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop } from "./Backdrop";
import { registry, resolveProps } from "./registry";
import manifest from "./specs/E0X-manifest.json";

// Master router. Maps over the compiled manifest and renders each overlay inside
// a Sequence, so useCurrentFrame() resets to 0 per clip and the per-component
// enter/exit springs just work.
export const OverlayManager: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      {manifest.overlays.map((o, i) => {
        const Comp = registry[o.type];
        if (!Comp) return null;
        return (
          <Sequence
            key={`${o.type}-${i}`}
            from={o.startFrame}
            durationInFrames={o.endFrame - o.startFrame}
            name={o.type}
          >
            <Comp {...resolveProps(o.type, o.props as Record<string, unknown>)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
