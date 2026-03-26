import {
  Dashboard  as DashboardIcon,
  People     as PeopleIcon,
  Inventory  as InventoryIcon,
  BarChart   as BarChartIcon,
  Settings   as SettingsIcon,
} from "@mui/icons-material";
import { type ReactElement } from "react";

export interface NavItem {
  label: string;
  icon: ReactElement;
}

/**
 * NAV_ITEMS
 * Single source of truth for the sidebar / bottom navigation menu.
 * Add, remove, or re-order entries here and every navigation component
 * picks up the change automatically.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Users",     icon: <PeopleIcon />     },
  { label: "Products",  icon: <InventoryIcon />  },
  { label: "Reports",   icon: <BarChartIcon />   },
  { label: "Settings",  icon: <SettingsIcon />   },
];
