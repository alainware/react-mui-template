import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { NAV_ITEMS } from "../../config/navigation";
import { BOTTOM_NAV_HEIGHT } from "../../constants/layout";

interface Props {
  activeNav: string;
  onNavigate: (label: string) => void;
}

/**
 * BottomNav
 * Fixed bottom navigation bar shown exclusively on mobile (xs breakpoint).
 * Navigation items are driven by NAV_ITEMS config, matching the sidebar.
 */
export function BottomNav({ activeNav, onNavigate }: Props) {
  return (
    <BottomNavigation
      value={activeNav}
      onChange={(_, val: string) => onNavigate(val)}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderTop: "1px solid",
        borderColor: "divider",
        height: BOTTOM_NAV_HEIGHT,
      }}
    >
      {NAV_ITEMS.map(({ label, icon }) => (
        <BottomNavigationAction
          key={label}
          label={label}
          value={label}
          icon={icon}
          sx={{ minWidth: 0, px: 0 }}
        />
      ))}
    </BottomNavigation>
  );
}
