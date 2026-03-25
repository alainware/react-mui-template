import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { createAppTheme } from "../theme";
import type { ColorMode } from "../types";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useThemeContext
 * Gives any component access to the current color mode and a toggle function.
 * Must be used inside <AppThemeProvider>.
 */
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used inside <AppThemeProvider>");
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * AppThemeProvider
 * Wraps the MUI ThemeProvider and exposes color-mode state via context.
 * Place this at the very top of the component tree (in main.tsx or App.tsx).
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [colorMode, setColorMode] = useState<ColorMode>(
    prefersDark ? "dark" : "light",
  );

  const toggleColorMode = () =>
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(() => createAppTheme(colorMode), [colorMode]);

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
