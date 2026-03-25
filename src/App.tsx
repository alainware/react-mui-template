import { useState, type JSX } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { MainLayout }       from "./layouts/MainLayout";
import { UsersPage }        from "./features/users/UsersPage";

/**
 * Page registry
 * Maps each nav label to its page component.  When you add a new section,
 * create a feature folder, export a Page component, and add an entry here.
 * No routing library is required at this scale; swap for React Router or
 * TanStack Router when the app grows beyond a handful of pages.
 */
const PAGES: Record<string, JSX.Element> = {
  Users: <UsersPage />,
};

/**
 * App
 * Root of the component tree.
 *  1. AppThemeProvider  — MUI theme + color-mode state
 *  2. SnackbarProvider  — global toast notifications
 *  3. MainLayout        — responsive shell (topbar, sidebar, bottom nav)
 *  4. Active page       — resolved from PAGES registry
 */
export default function App() {
  const [activeNav, setActiveNav] = useState("Users");

  const activePage = PAGES[activeNav] ?? (
    <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 2 }}>
      <Typography variant="h6" color="text.secondary">
        {activeNav} — coming soon
      </Typography>
    </Paper>
  );

  return (
    <AppThemeProvider>
      <SnackbarProvider>
        <MainLayout activeNav={activeNav} onNavigate={setActiveNav}>
          <Box>{activePage}</Box>
        </MainLayout>
      </SnackbarProvider>
    </AppThemeProvider>
  );
}
