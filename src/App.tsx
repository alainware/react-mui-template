import { useState, useMemo } from "react";
import {
  Box,
  Toolbar,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  CssBaseline,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 64;
const BOTTOM_NAV_HEIGHT = 56;

// ─── Types ────────────────────────────────────────────────────────────────────

type Order = "asc" | "desc";
type ColorMode = "light" | "dark";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Inactive";
  createdAt: string;
}

interface Column {
  id: keyof User;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  /** Hide this column below the given breakpoint: "sm" = hidden on xs, "md" = hidden on xs+sm */
  hideBelow?: "sm" | "md";
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Users", icon: <PeopleIcon /> },
  { label: "Products", icon: <InventoryIcon /> },
  { label: "Reports", icon: <BarChartIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
];

const COLUMNS: Column[] = [
  { id: "id", label: "ID", minWidth: 50, hideBelow: "sm" },
  { id: "name", label: "Name", minWidth: 140 },
  { id: "email", label: "Email", minWidth: 180, hideBelow: "md" },
  { id: "role", label: "Role", minWidth: 90, align: "center", hideBelow: "sm" },
  { id: "status", label: "Status", minWidth: 90, align: "center" },
  { id: "createdAt", label: "Created At", minWidth: 120, align: "right", hideBelow: "md" },
];

const INITIAL_USERS: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", createdAt: "2024-01-15" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "Editor", status: "Active", createdAt: "2024-02-20" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive", createdAt: "2024-03-05" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Editor", status: "Active", createdAt: "2024-03-18" },
  { id: 5, name: "Eva López", email: "eva@example.com", role: "Viewer", status: "Active", createdAt: "2024-04-02" },
  { id: 6, name: "Frank Chen", email: "frank@example.com", role: "Admin", status: "Inactive", createdAt: "2024-04-10" },
  { id: 7, name: "Grace Park", email: "grace@example.com", role: "Viewer", status: "Active", createdAt: "2024-05-01" },
];

const EMPTY_FORM: Omit<User, "id" | "createdAt"> = {
  name: "",
  email: "",
  role: "Viewer",
  status: "Active",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T) {
  return order === "desc"
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}

function roleColor(role: User["role"]): "error" | "primary" | "default" {
  if (role === "Admin") return "error";
  if (role === "Editor") return "primary";
  return "default";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Sidebar navigation list — reused by both temporary and permanent drawers */
function SidebarList({
  open,
  activeNav,
  onNavigate,
}: {
  open: boolean;
  activeNav: string;
  onNavigate: (label: string) => void;
}) {
  return (
    <List disablePadding>
      {NAV_ITEMS.map(({ label, icon }) => (
        <ListItem key={label} disablePadding sx={{ display: "block" }}>
          <Tooltip title={!open ? label : ""} placement="right">
            <ListItemButton
              selected={activeNav === label}
              onClick={() => onNavigate(label)}
              sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
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

/** Status chip */
function StatusChip({ status }: { status: User["status"] }) {
  return (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "default"}
      variant={status === "Active" ? "filled" : "outlined"}
    />
  );
}

/** Create / Edit dialog — goes full-screen on mobile */
function UserFormDialog({
  open,
  editingUser,
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editingUser: User | null;
  form: typeof EMPTY_FORM;
  onChange: (field: keyof typeof EMPTY_FORM, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEdit = Boolean(editingUser);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField label="Full Name" value={form.name} onChange={(e) => onChange("name", e.target.value)} fullWidth required />
        <TextField label="Email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} fullWidth required />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select value={form.role} label="Role" onChange={(e) => onChange("role", e.target.value)}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
            <MenuItem value="Viewer">Viewer</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={form.status} label="Status" onChange={(e) => onChange("status", e.target.value)}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!form.name || !form.email}>
          {isEdit ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Delete confirmation dialog */
function DeleteDialog({ user, onClose, onConfirm }: { user: User | null; onClose: () => void; onConfirm: () => void }) {
  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{user?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Root: provides the theme ─────────────────────────────────────────────────

export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [colorMode, setColorMode] = useState<ColorMode>(prefersDark ? "dark" : "light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: colorMode, primary: { main: "#1976d2" } },
        typography: { fontFamily: "Roboto, sans-serif" },
        shape: { borderRadius: 8 },
      }),
    [colorMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent colorMode={colorMode} setColorMode={setColorMode} />
    </ThemeProvider>
  );
}

// ─── AppContent: reads theme breakpoints ─────────────────────────────────────

function AppContent({ colorMode, setColorMode }: { colorMode: ColorMode; setColorMode: (m: ColorMode) => void }) {
  const theme = useTheme();

  // Breakpoints
  const isMobile  = useMediaQuery(theme.breakpoints.down("sm"));          // < 600 px
  const isTablet  = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900 px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));            // ≥ 900 px

  // Drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen]         = useState(false);
  const [desktopDrawerExpanded, setDesktopDrawerExpanded] = useState(true);

  const permanentDrawerWidth = desktopDrawerExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  // Navigation
  const [activeNav, setActiveNav] = useState("Users");

  // Data
  const [users, setUsers]   = useState<User[]>(INITIAL_USERS);
  const [nextId, setNextId] = useState(INITIAL_USERS.length + 1);

  // Table
  const [order, setOrder]           = useState<Order>("asc");
  const [orderBy, setOrderBy]       = useState<keyof User>("id");
  const [page, setPage]             = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [formOpen, setFormOpen]       = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm]               = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });

  // Snackbar
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  // ── Derived data ────────────────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const sortedUsers    = useMemo(() => [...filteredUsers].sort(getComparator(order, orderBy)), [filteredUsers, order, orderBy]);
  const paginatedUsers = useMemo(() => sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedUsers, page, rowsPerPage]);

  // Filter visible columns per breakpoint
  const visibleColumns = useMemo(
    () =>
      COLUMNS.filter((col) => {
        if (col.hideBelow === "sm" && isMobile) return false;
        if (col.hideBelow === "md" && (isMobile || isTablet)) return false;
        return true;
      }),
    [isMobile, isTablet]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSort = (col: keyof User) => {
    setOrder(orderBy === col && order === "asc" ? "desc" : "asc");
    setOrderBy(col);
  };

  const openCreate = () => { setEditingUser(null); setForm({ ...EMPTY_FORM }); setFormOpen(true); };
  const openEdit   = (user: User) => { setEditingUser(user); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); setFormOpen(true); };

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFormSubmit = () => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)));
      showSnack("User updated successfully.");
    } else {
      setUsers((prev) => [{ id: nextId, ...form, createdAt: new Date().toISOString().split("T")[0] }, ...prev]);
      setNextId((n) => n + 1);
      setPage(0);
      showSnack("User created successfully.");
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
    showSnack("User deleted.", "error");
  };

  const showSnack = (message: string, severity: "success" | "error" = "success") =>
    setSnack({ open: true, message, severity });

  const handleNavChange = (label: string) => {
    setActiveNav(label);
    if (isMobile) setMobileDrawerOpen(false);
  };

  // ── Shared drawer content ────────────────────────────────────────────────

  const drawerContent = (expanded: boolean) => (
    <>
      <Toolbar />
      <Divider />
      <SidebarList open={expanded} activeNav={activeNav} onNavigate={handleNavChange} />
    </>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Top Bar */}
      <AppBar position="fixed" elevation={1} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() =>
              isMobile ? setMobileDrawerOpen((v) => !v) : setDesktopDrawerExpanded((v) => !v)
            }
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            MyApp
          </Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit"><NotificationsIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Toggle theme">
            <IconButton color="inherit" onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}>
              {colorMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Avatar sx={{ ml: 1, width: 34, height: 34, bgcolor: "secondary.main", fontSize: 14 }}>JD</Avatar>
        </Toolbar>
      </AppBar>

      {/* Mobile — temporary overlay drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {drawerContent(true)}
        </Drawer>
      )}

      {/* Tablet — permanent icon-only drawer */}
      {isTablet && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_COLLAPSED_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: DRAWER_COLLAPSED_WIDTH, overflowX: "hidden", boxSizing: "border-box" },
          }}
        >
          {drawerContent(false)}
        </Drawer>
      )}

      {/* Desktop — permanent expandable drawer */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: permanentDrawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: permanentDrawerWidth,
              overflowX: "hidden",
              transition: (t) =>
                t.transitions.create("width", {
                  easing: t.transitions.easing.sharp,
                  duration: desktopDrawerExpanded
                    ? t.transitions.duration.enteringScreen
                    : t.transitions.duration.leavingScreen,
                }),
            },
          }}
        >
          {drawerContent(desktopDrawerExpanded)}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 1.5, sm: 2, md: 3 },
          pt: 3,
          // Reserve space for BottomNavigation on mobile
          pb: isMobile ? `${BOTTOM_NAV_HEIGHT + 16}px` : 3,
        }}
      >
        <Toolbar />

        {/* Page header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
            {activeNav}
          </Typography>
          {/* Show button in header on tablet/desktop; FAB handles mobile */}
          {activeNav === "Users" && !isMobile && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              {isTablet ? "Create" : "Create User"}
            </Button>
          )}
        </Box>

        {/* Users view */}
        {activeNav === "Users" && (
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

            {/* Search */}
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid", borderColor: "divider" }}>
              <TextField
                placeholder="Search users…"
                size="small"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                  ),
                }}
                sx={{ width: { xs: "100%", sm: 280 } }}
              />
            </Box>

            {/* Table */}
            <TableContainer>
              <Table stickyHeader size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align ?? "left"}
                        style={{ minWidth: col.minWidth }}
                        sx={{ fontWeight: 700 }}
                      >
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleSort(col.id)}
                        >
                          {col.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length + 1} align="center" sx={{ py: 6, color: "text.secondary" }}>
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        {visibleColumns.map((col) => {
                          if (col.id === "name") return (
                            <TableCell key={col.id}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar sx={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, fontSize: isMobile ? 10 : 12, bgcolor: "primary.main" }}>
                                  {user.name.split(" ").map((n) => n[0]).join("")}
                                </Avatar>
                                <Typography variant="body2" noWrap sx={{ maxWidth: { xs: 110, sm: "none" } }}>
                                  {user.name}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                          if (col.id === "role") return (
                            <TableCell key={col.id} align="center">
                              <Chip label={user.role} size="small" color={roleColor(user.role)} variant="outlined" />
                            </TableCell>
                          );
                          if (col.id === "status") return (
                            <TableCell key={col.id} align="center">
                              <StatusChip status={user.status} />
                            </TableCell>
                          );
                          return (
                            <TableCell key={col.id} align={col.align ?? "left"}>
                              {String(user[col.id])}
                            </TableCell>
                          );
                        })}
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(user)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeletingUser(user)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination — hide rows-per-page on mobile */}
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={isMobile ? [] : [5, 10, 25]}
              labelRowsPerPage={isTablet ? "Rows:" : "Rows per page:"}
            />
          </Paper>
        )}

        {/* Other sections placeholder */}
        {activeNav !== "Users" && (
          <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {activeNav} — coming soon
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Mobile — Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          value={activeNav}
          onChange={(_, val) => setActiveNav(val)}
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
            <BottomNavigationAction key={label} label={label} value={label} icon={icon} sx={{ minWidth: 0, px: 0 }} />
          ))}
        </BottomNavigation>
      )}

      {/* Mobile — FAB for Create User (sits above BottomNavigation) */}
      {isMobile && activeNav === "Users" && (
        <Fab
          color="primary"
          aria-label="Create User"
          onClick={openCreate}
          sx={{
            position: "fixed",
            bottom: BOTTOM_NAV_HEIGHT + 16,
            right: 16,
            zIndex: (t) => t.zIndex.appBar,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialogs */}
      <UserFormDialog
        open={formOpen}
        editingUser={editingUser}
        form={form}
        onChange={handleFormChange}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
      <DeleteDialog
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
