import React, { createContext, useContext, useMemo } from "react";
import type { VideoTheme } from "./types";
import { themeFonts, type ThemeFonts } from "../fonts";
import { DEFAULT_THEME_ID, getTheme } from "./registry";

interface ThemeContextValue {
  theme: VideoTheme;
  fonts: ThemeFonts;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{
  theme: VideoTheme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, fonts: themeFonts(theme) }),
    [theme]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): VideoTheme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return getTheme(DEFAULT_THEME_ID);
  return ctx.theme;
};

export const useFonts = (): ThemeFonts => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return themeFonts(getTheme(DEFAULT_THEME_ID));
  return ctx.fonts;
};
