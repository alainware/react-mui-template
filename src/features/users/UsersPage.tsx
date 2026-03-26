import { useState, useMemo } from "react";
import { Box, Button, Fab, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { UsersTable }     from "@/features/users/UsersTable";
import { UserFormDialog } from "@/features/users//UserFormDialog";
import { DeleteDialog }   from "@/features/users//DeleteDialog";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useSnackbar }    from "@/contexts/SnackbarContext";
import { getComparator }  from "@/utils/table";
import {
  INITIAL_USERS,
  EMPTY_FORM,
  type UserFormData,
} from "@/config/users";
import { BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import type { Order, User } from "@/types";

/**
 * UsersPage
 * Container component for the Users feature.  Owns all local state (data,
 * sorting, pagination, dialogs) and passes derived data + callbacks down to
 * pure child components.
 *
 * In a real app this is where you would call your API hooks (e.g. useQuery,
 * useMutation) instead of managing useState directly.
 */
export function UsersPage() {
  const { isMobile, isTablet } = useBreakpoints();
  const { showSnackbar }       = useSnackbar();

  // ── Data ──────────────────────────────────────────────────────────────────

  const [users, setUsers]   = useState<User[]>(INITIAL_USERS);
  const [nextId, setNextId] = useState(INITIAL_USERS.length + 1);

  // ── Table state ───────────────────────────────────────────────────────────

  const [order, setOrder]             = useState<Order>("asc");
  const [orderBy, setOrderBy]         = useState<keyof User>("id");
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Dialog state ──────────────────────────────────────────────────────────

  const [formOpen, setFormOpen]         = useState(false);
  const [editingUser, setEditingUser]   = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm]                 = useState<UserFormData>({ ...EMPTY_FORM });

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q)   ||
        u.email.toLowerCase().includes(q)  ||
        u.role.toLowerCase().includes(q)   ||
        u.status.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort(getComparator(order, orderBy));
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredUsers, order, orderBy, page, rowsPerPage]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSort = (col: keyof User) => {
    setOrder(orderBy === col && order === "asc" ? "desc" : "asc");
    setOrderBy(col);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(0);
  };

  const handleRowsPerPageChange = (rpp: number) => {
    setRowsPerPage(rpp);
    setPage(0);
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

  const handleFormChange = (field: keyof UserFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFormSubmit = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)),
      );
      showSnackbar("User updated successfully.");
    } else {
      const newUser: User = {
        id: nextId,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [newUser, ...prev]);
      setNextId((n) => n + 1);
      setPage(0);
      showSnackbar("User created successfully.");
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
    showSnackbar("User deleted.", "error");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
          Users
        </Typography>

        {/* Create button — visible on tablet/desktop; FAB handles mobile */}
        {!isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            {isTablet ? "Create" : "Create User"}
          </Button>
        )}
      </Box>

      {/* Table */}
      <UsersTable
        rows={paginatedUsers}
        totalCount={filteredUsers.length}
        order={order}
        orderBy={orderBy}
        page={page}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        onSort={handleSort}
        onPageChange={setPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearchChange={handleSearchChange}
        onEdit={openEdit}
        onDelete={setDeletingUser}
      />

      {/* Mobile FAB — sits above the BottomNavigation */}
      {isMobile && (
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
    </>
  );
}
