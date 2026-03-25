import { useMediaQuery, useTheme } from "@mui/material";

/**
 * useBreakpoints
 * Returns semantic flags for the current viewport width.
 * Components import this instead of calling useMediaQuery directly, so
 * the breakpoint logic lives in a single place.
 *
 * isMobile  → xs only        (< 600 px)
 * isTablet  → sm only        (600 – 899 px)
 * isDesktop → md and above   (≥ 900 px)
 */
export function useBreakpoints() {
  const theme = useTheme();

  const isMobile  = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet  = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return { isMobile, isTablet, isDesktop };
}
