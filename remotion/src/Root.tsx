import React from "react";
import { AbsoluteFill, Composition, Folder, staticFile } from "remotion";
import { Backdrop } from "./Backdrop";
import { OverlayManager } from "./OverlayManager";
import { ThemeProvider } from "./themes/context";
import { themeList, getTheme, type ThemeId } from "./themes/registry";
import type { VideoTheme } from "./themes/types";
import { TitleCard } from "./components/TitleCard";
import { MediaFrame } from "./components/MediaFrame";
import { KeyTermChip } from "./components/KeyTermChip";
import { TextOverlay } from "./components/TextOverlay";
import { LowerThird } from "./components/LowerThird";
import { StepBadge } from "./components/StepBadge";

const W = 1080;
const H = 1920;
const FPS = 30;

// Wraps an overlay over the footage stand-in so it's viewable in isolation.
const Preview: React.FC<{ children: React.ReactNode; opaque?: boolean }> = ({
  children,
  opaque,
}) => (
  <AbsoluteFill>
    {opaque ? null : <Backdrop />}
    {children}
  </AbsoluteFill>
);

// One entry per overlay shown for every theme.
const overlays: {
  key: string;
  duration: number;
  opaque?: boolean;
  render: () => React.ReactNode;
}[] = [
  {
    key: "TitleCard",
    duration: 110,
    opaque: true,
    render: () => <TitleCard eyebrow="Chapter 01" title="Stop Budgeting." />,
  },
  {
    key: "MediaFrame",
    duration: 120,
    render: () => (
      <MediaFrame src={staticFile("burn-rate.png")} aspectRatio="landscape" />
    ),
  },
  {
    key: "MediaFrame-Vertical",
    duration: 120,
    render: () => (
      <MediaFrame src={staticFile("mobile-ui.png")} aspectRatio="vertical" />
    ),
  },
  {
    key: "KeyTermChip",
    duration: 130,
    render: () => (
      <KeyTermChip
        term="Daily Burn Rate"
        definition="The exact cost required for your existence over a 24 hour window."
      />
    ),
  },
  {
    key: "TextOverlay",
    duration: 90,
    opaque: true,
    render: () => (
      <TextOverlay
        text="Treat your life like a data problem."
        attribution="The thesis"
      />
    ),
  },
  {
    key: "LowerThird",
    duration: 90,
    render: () => <LowerThird title="Joe Tustin" handle="@joetustin" />,
  },
  {
    key: "StepBadge",
    duration: 90,
    render: () => <StepBadge step={1} label="Measure the burn" />,
  },
];

const Themed: React.FC<{ theme: VideoTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {themeList.map(({ id }) => {
        const theme = getTheme(id as ThemeId);
        const slug = id.replace(/_/g, "-");
        return (
          <Folder name={slug} key={id}>
            {/* Full compiled timeline per theme */}
            <Composition
              id={`${slug}--Timeline`}
              component={() => (
                <Themed theme={theme}>
                  <OverlayManager />
                </Themed>
              )}
              durationInFrames={540}
              fps={FPS}
              width={W}
              height={H}
            />
            {overlays.map((o) => (
              <Composition
                key={o.key}
                id={`${slug}--${o.key}`}
                component={() => (
                  <Themed theme={theme}>
                    <Preview opaque={o.opaque}>{o.render()}</Preview>
                  </Themed>
                )}
                durationInFrames={o.duration}
                fps={FPS}
                width={W}
                height={H}
              />
            ))}
          </Folder>
        );
      })}
    </>
  );
};
