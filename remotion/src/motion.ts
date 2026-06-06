// Motion vocabulary — image-independent (PRD §6.3).
// The reference image governs the static skin; THIS governs how things move.
// Hand-tuned, never derived from pixels. This is where taste lives.
import { interpolate, spring, type SpringConfig } from "remotion";

export const springs: Record<string, Partial<SpringConfig>> = {
  snappy: { damping: 18, mass: 0.6, stiffness: 180 },
  crisp: { damping: 26, mass: 0.8, stiffness: 120 },
  subtle: { damping: 30, mass: 1, stiffness: 70 },
  heavy: { damping: 40, mass: 1.6, stiffness: 60 },
};

export type MotionPreset = keyof typeof springs;

/** 0→1 progress for a spring enter, evaluated at the local frame. */
export const enter = (
  frame: number,
  fps: number,
  preset: MotionPreset = "crisp"
) => spring({ frame, fps, config: springs[preset] });

/**
 * A symmetric enter/exit envelope in [0,1]: rises with a spring on the way in,
 * falls with a short ease on the way out. `durationInFrames` is the clip length.
 */
export const envelope = (
  frame: number,
  fps: number,
  durationInFrames: number,
  preset: MotionPreset = "crisp",
  exitFrames = 12
) => {
  const inProgress = enter(frame, fps, preset);
  const out = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return Math.min(inProgress, out);
};

/** Common transform helpers built on a 0→1 progress value. */
export const rise = (progress: number, distance = 40) =>
  `translateY(${(1 - progress) * distance}px)`;

export const plateCompress = (progress: number) =>
  `scale(${interpolate(progress, [0, 1], [0.96, 1])})`;
