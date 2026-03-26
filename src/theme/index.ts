import { createTheme, type Theme } from "@mui/material";
import type { ColorMode } from "@/types";

/**
 * createAppTheme
 * Central place for every MUI theme token: palette, typography, shape,
 * component overrides, etc.  Import and call this wherever you need the theme
 * (ThemeContext, Storybook decorators, unit-test wrappers, …).
 */
export function createAppTheme(mode: ColorMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary:   { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      // Global component overrides go here as the app grows.
      // Example:s
      // MuiButton: { defaultProps: { disableElevation: true } },
    },
  });
}
