import { useMemo } from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit   as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { StatusChip } from "@/components/ui/StatusChip";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { COLUMNS } from "@/config/users";
import { roleColor } from "@/utils/table";
import type { Order, User } from "@/types";

interface Props {
  rows: User[];
  totalCount: number;
  order: Order;
  orderBy: keyof User;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  onSort: (col: keyof User) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rpp: number) => void;
  onSearchChange: (q: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * UsersTable
 * Pure presentational component: receives data and callbacks, renders the
 * search bar, sortable table, and pagination.  No local state.
 */
export function UsersTable({
  rows,
  totalCount,
  order,
  orderBy,
  page,
  rowsPerPage,
  searchQuery,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  onEdit,
  onDelete,
}: Props) {
  const { isMobile, isTablet } = useBreakpoints();

  // Filter columns by current breakpoint using the hideBelow config
  const visibleColumns = useMemo(
    () =>
      COLUMNS.filter((col) => {
        if (col.hideBelow === "sm" && isMobile)            return false;
        if (col.hideBelow === "md" && (isMobile || isTablet)) return false;
        return true;
      }),
    [isMobile, isTablet],
  );

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

      {/* ── Search bar ── */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <TextField
          placeholder="Search users…"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: "100%", sm: 280 } }}
        />
      </Box>

      {/* ── Table ── */}
      <TableContainer>
        <Table stickyHeader size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align ?? "left"}
                  style={{ minWidth: col.minWidth }}
                  sx={{ fontWeight: 700 }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => onSort(col.id as keyof User)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 1}
                  align="center"
                  sx={{ py: 6, color: "text.secondary" }}
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((user) => (
                <TableRow key={user.id} hover>
                  {visibleColumns.map((col) => {
                    // ── Custom cell renderers ───────────────────────────────
                    if (col.id === "name") {
                      return (
                        <TableCell key="name">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              sx={{
                                width:    isMobile ? 24 : 28,
                                height:   isMobile ? 24 : 28,
                                fontSize: isMobile ? 10 : 12,
                                bgcolor: "primary.main",
                              }}
                            >
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </Avatar>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: { xs: 110, sm: "none" } }}
                            >
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                      );
                    }

                    if (col.id === "role") {
                      return (
                        <TableCell key="role" align="center">
                          <Chip
                            label={user.role}
                            size="small"
                            color={roleColor(user.role)}
                            variant="outlined"
                          />
                        </TableCell>
                      );
                    }

                    if (col.id === "status") {
                      return (
                        <TableCell key="status" align="center">
                          <StatusChip status={user.status} />
                        </TableCell>
                      );
                    }

                    // ── Default cell ────────────────────────────────────────
                    return (
                      <TableCell key={String(col.id)} align={col.align ?? "left"}>
                        {String(user[col.id as keyof User])}
                      </TableCell>
                    );
                  })}

                  {/* ── Actions ── */}
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(user)}>
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

      {/* ── Pagination ── */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, p) => onPageChange(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={isMobile ? [] : [5, 10, 25]}
        labelRowsPerPage={isTablet ? "Rows:" : "Rows per page:"}
      />
    </Paper>
  );
}
