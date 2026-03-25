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
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
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
  { id: "id", label: "ID", minWidth: 60 },
  { id: "name", label: "Name", minWidth: 160 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "role", label: "Role", minWidth: 100, align: "center" },
  { id: "status", label: "Status", minWidth: 100, align: "center" },
  { id: "createdAt", label: "Created At", minWidth: 130, align: "right" },
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

// ─── Sub-components (inline, to be split later) ───────────────────────────────

/** Sidebar navigation */
function Sidebar({
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

/** Create / Edit dialog */
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
  const isEdit = Boolean(editingUser);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField
          label="Full Name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={form.role}
            label="Role"
            onChange={(e) => onChange("role", e.target.value)}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
            <MenuItem value="Viewer">Viewer</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status}
            label="Status"
            onChange={(e) => onChange("status", e.target.value)}
          >
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
function DeleteDialog({
  user,
  onClose,
  onConfirm,
}: {
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
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

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // Theme
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [colorMode, setColorMode] = useState<ColorMode>(prefersDark ? "dark" : "light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          primary: { main: "#1976d2" },
        },
        typography: { fontFamily: "Roboto, sans-serif" },
        shape: { borderRadius: 8 },
      }),
    [colorMode]
  );

  // Layout state
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Users");

  // Data state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [nextId, setNextId] = useState(INITIAL_USERS.length + 1);

  // Table state
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });

  // Snackbar state
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
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

  const sortedUsers = useMemo(
    () => [...filteredUsers].sort(getComparator(order, orderBy)),
    [filteredUsers, order, orderBy]
  );

  const paginatedUsers = useMemo(
    () => sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedUsers, page, rowsPerPage]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSort = (col: keyof User) => {
    const isAsc = orderBy === col && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(col);
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setFormOpen(true);
  };

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
      );
      showSnack("User updated successfully.");
    } else {
      const newUser: User = {
        id: nextId,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [newUser, ...prev]);
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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>

        {/* ── Top Bar ── */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            zIndex: (t) => t.zIndex.drawer + 1,
            transition: (t) =>
              t.transitions.create(["width", "margin"], {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.leavingScreen,
              }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen((v) => !v)}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
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
              <IconButton
                color="inherit"
                onClick={() => setColorMode((m) => (m === "light" ? "dark" : "light"))}
              >
                {colorMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Avatar sx={{ ml: 1, width: 34, height: 34, bgcolor: "secondary.main", fontSize: 14 }}>
              JD
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* ── Side Nav ── */}
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: drawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
              overflowX: "hidden",
              transition: (t) =>
                t.transitions.create("width", {
                  easing: t.transitions.easing.sharp,
                  duration: drawerOpen
                    ? t.transitions.duration.enteringScreen
                    : t.transitions.duration.leavingScreen,
                }),
            },
          }}
        >
          <Toolbar />
          <Divider />
          <Sidebar open={drawerOpen} activeNav={activeNav} onNavigate={setActiveNav} />
        </Drawer>

        {/* ── Main Content ── */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          {/* Page header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {activeNav}
            </Typography>
            {activeNav === "Users" && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                Create User
              </Button>
            )}
          </Box>

          {/* Users view */}
          {activeNav === "Users" && (
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

              {/* Search bar */}
              <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <TextField
                  placeholder="Search users…"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
              </Box>

              {/* Table */}
              <TableContainer>
                <Table stickyHeader size="medium">
                  <TableHead>
                    <TableRow>
                      {COLUMNS.map((col) => (
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
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 6, color: "text.secondary" }}>
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "primary.main" }}>
                                {user.name.split(" ").map((n) => n[0]).join("")}
                              </Avatar>
                              {user.name}
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell align="center">
                            <Chip label={user.role} size="small" color={roleColor(user.role)} variant="outlined" />
                          </TableCell>
                          <TableCell align="center">
                            <StatusChip status={user.status} />
                          </TableCell>
                          <TableCell align="right">{user.createdAt}</TableCell>
                          <TableCell align="center">
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

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Paper>
          )}

          {/* Placeholder for other nav items */}
          {activeNav !== "Users" && (
            <Paper elevation={2} sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                {activeNav} — coming soon
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* ── Dialogs ── */}
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

      {/* ── Snackbar ── */}
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
    </ThemeProvider>
  );
}
