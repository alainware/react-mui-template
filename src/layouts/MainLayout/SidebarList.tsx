import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { NAV_ITEMS } from "@/config/navigation";

interface Props {
  /** Whether the sidebar is in expanded (true) or icon-only (false) mode. */
  open: boolean;
  activeNav: string;
  onNavigate: (label: string) => void;
}

/**
 * SidebarList
 * Renders the navigation links for both the permanent desktop drawer and the
 * temporary mobile overlay.  The `open` flag switches between full labels and
 * icon-only mode; tooltips appear automatically in collapsed mode.
 */
export function SidebarList({ open, activeNav, onNavigate }: Props) {
  return (
    <List disablePadding>
      {NAV_ITEMS.map(({ label, icon }) => (
        <ListItem key={label} disablePadding sx={{ display: "block" }}>
          <Tooltip title={!open ? label : ""} placement="right">
            <ListItemButton
              selected={activeNav === label}
              onClick={() => onNavigate(label)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}
              >
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={label} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
}
