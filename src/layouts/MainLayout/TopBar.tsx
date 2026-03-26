import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DarkMode  as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu      as MenuIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/contexts/ThemeContext";

interface Props {
  onMenuClick: () => void;
}

/**
 * TopBar
 * Fixed application bar with hamburger menu, app title, theme toggle,
 * notifications and user avatar.
 * The onMenuClick handler is provided by MainLayout and behaves differently
 * depending on the current breakpoint (open overlay vs collapse permanent).
 */
export function TopBar({ onMenuClick }: Props) {
  const { colorMode, toggleColorMode } = useThemeContext();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
          MyApp
        </Typography>

        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle theme">
          <IconButton color="inherit" onClick={toggleColorMode}>
            {colorMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        <Avatar sx={{ ml: 1, width: 34, height: 34, bgcolor: "secondary.main", fontSize: 14 }}>
          JD
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
