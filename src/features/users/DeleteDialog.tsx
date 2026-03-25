import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { User } from "../../types";

interface Props {
  /** The user to delete; null means the dialog is closed. */
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * DeleteDialog
 * Shows the target user's name and asks for explicit confirmation before
 * permanently deleting a record.
 */
export function DeleteDialog({ user, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{user?.name}</strong>?{" "}
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
