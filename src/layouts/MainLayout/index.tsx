import { useState, ReactNode } from "react";
import { Box, Divider, Drawer, Toolbar } from "@mui/material";
import { TopBar }      from "./TopBar";
import { SidebarList } from "./SidebarList";
import { BottomNav }   from "./BottomNav";
import { useBreakpoints } from "../../hooks/useBreakpoints";
import {
  BOTTOM_NAV_HEIGHT,
  DRAWER_COLLAPSED_WIDTH,
  DRAWER_WIDTH,
} from "../../constants/layout";

interface Props {
  activeNav: string;
  onNavigate: (label: string) => void;
  children: ReactNode;
}

/**
 * MainLayout
 * Responsive application shell.  Behaviour per breakpoint:
 *
 *  Mobile  (xs / < 600 px)
 *    • Hamburger opens a full-width temporary overlay drawer.
 *    • Bottom navigation bar replaces the sidebar for quick switching.
 *
 *  Tablet  (sm / 600–899 px)
 *    • Permanent icon-only drawer (always visible, never collapses further).
 *    • No bottom navigation.
 *
 *  Desktop (md / ≥ 900 px)
 *    • Permanent drawer that expands (240 px) or collapses to icons (64 px).
 *    • Hamburger controls the expand/collapse state.
 */
export function MainLayout({ activeNav, onNavigate, children }: Props) {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  // Mobile: temporary overlay open/closed
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Desktop: permanent drawer expanded/collapsed
  const [desktopExpanded, setDesktopExpanded] = useState(true);

  const permanentWidth = desktopExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  // Called by TopBar's hamburger button — behaviour differs per breakpoint.
  const handleMenuClick = () => {
    if (isMobile) {
      setMobileDrawerOpen((v) => !v);
    } else {
      setDesktopExpanded((v) => !v);
    }
  };

  // Close mobile drawer and navigate
  const handleNavigate = (label: string) => {
    onNavigate(label);
    if (isMobile) setMobileDrawerOpen(false);
  };

  // ── Shared drawer body ─────────────────────────────────────────────────────
  const drawerBody = (expanded: boolean) => (
    <>
      <Toolbar /> {/* spacer so content clears the fixed AppBar */}
      <Divider />
      <SidebarList open={expanded} activeNav={activeNav} onNavigate={handleNavigate} />
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Top Bar ── */}
      <TopBar onMenuClick={handleMenuClick} />

      {/* ── Mobile: temporary overlay drawer ── */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }} // better open performance on mobile
          sx={{
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {drawerBody(true)}
        </Drawer>
      )}

      {/* ── Tablet: permanent icon-only drawer ── */}
      {isTablet && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_COLLAPSED_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_COLLAPSED_WIDTH,
              overflowX: "hidden",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerBody(false)}
        </Drawer>
      )}

      {/* ── Desktop: permanent expandable drawer ── */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: permanentWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: permanentWidth,
              overflowX: "hidden",
              transition: (t) =>
                t.transitions.create("width", {
                  easing: t.transitions.easing.sharp,
                  duration: desktopExpanded
                    ? t.transitions.duration.enteringScreen
                    : t.transitions.duration.leavingScreen,
                }),
            },
          }}
        >
          {drawerBody(desktopExpanded)}
        </Drawer>
      )}

      {/* ── Main content area ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0, // prevents flex overflow on narrow screens
          px: { xs: 1.5, sm: 2, md: 3 },
          pt: 3,
          pb: isMobile ? `${BOTTOM_NAV_HEIGHT + 16}px` : 3,
        }}
      >
        <Toolbar /> {/* spacer so content clears the fixed AppBar */}
        {children}
      </Box>

      {/* ── Mobile: bottom navigation ── */}
      {isMobile && (
        <BottomNav activeNav={activeNav} onNavigate={handleNavigate} />
      )}
    </Box>
  );
}
