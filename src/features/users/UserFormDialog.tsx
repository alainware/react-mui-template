import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { User } from "../../types";
import type { UserFormData } from "../../config/users";

interface Props {
  open: boolean;
  /** Populated when editing; null when creating. */
  editingUser: User | null;
  form: UserFormData;
  onChange: (field: keyof UserFormData, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * UserFormDialog
 * Shared create / edit dialog for the Users feature.
 * Goes full-screen on mobile for a better touch experience.
 */
export function UserFormDialog({
  open,
  editingUser,
  form,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  const theme      = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEdit     = Boolean(editingUser);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
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
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!form.name || !form.email}
        >
          {isEdit ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
