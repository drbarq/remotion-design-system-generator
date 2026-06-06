import type { VideoTheme } from "./types";
// Source of truth: the remstyle output catalog in /designs (tokens.ts + reference
// .png live together there). We import, not copy, so regenerating a design is
// picked up with no drift. Each file exports a differently-named const, so we
// normalize them into one uniform registry here.
import { industrial_developer_theme } from "../../../designs/industrial_developer/theme";
import { apple_vercel_theme } from "../../../designs/apple_vercel/theme";
import { blade_runner_theme } from "../../../designs/blade_runner/theme";
import { notion_ish_theme } from "../../../designs/notion-ish/theme";

export type ThemeId =
  | "industrial_developer"
  | "apple_vercel"
  | "blade_runner"
  | "notion_ish";

export const themes: Record<ThemeId, VideoTheme> = {
  industrial_developer: industrial_developer_theme,
  apple_vercel: apple_vercel_theme,
  blade_runner: blade_runner_theme,
  notion_ish: notion_ish_theme,
};

// Ordered list for building compositions / contact sheets.
export const themeList: { id: ThemeId; label: string }[] = [
  { id: "industrial_developer", label: industrial_developer_theme.themeName },
  { id: "apple_vercel", label: apple_vercel_theme.themeName },
  { id: "blade_runner", label: blade_runner_theme.themeName },
  { id: "notion_ish", label: notion_ish_theme.themeName },
];

export const DEFAULT_THEME_ID: ThemeId = "industrial_developer";

export const getTheme = (id: ThemeId): VideoTheme => themes[id];
