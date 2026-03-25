import type { Order, User } from "../types";

// ─── Generic sort helpers ─────────────────────────────────────────────────────

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return  1;
  return 0;
}

/**
 * getComparator
 * Returns a sort comparator for the given column and direction.
 * Usage: [...rows].sort(getComparator(order, orderBy))
 */
export function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) =>  descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ─── User-specific helpers ────────────────────────────────────────────────────

/**
 * roleColor
 * Maps a User role to its MUI Chip color.
 * Centralised here so the mapping is never duplicated across components.
 */
export function roleColor(role: User["role"]): "error" | "primary" | "default" {
  if (role === "Admin")  return "error";
  if (role === "Editor") return "primary";
  return "default";
}
