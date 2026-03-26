import { Chip } from "@mui/material";
import type { User } from "@/types";

interface Props {
  status: User["status"];
}

/**
 * StatusChip
 * Renders a colour-coded MUI Chip for a User's active/inactive status.
 * Kept in components/ui so it can be reused across features if other
 * entities also have an Active / Inactive status field.
 */
export function StatusChip({ status }: Props) {
  return (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "default"}
      variant={status === "Active" ? "filled" : "outlined"}
    />
  );
}
