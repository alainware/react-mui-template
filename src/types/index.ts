// ─── Shared domain types ──────────────────────────────────────────────────────
// Keep all cross-cutting types here. Feature-specific types live alongside
// their feature (e.g. src/features/users/).

// ── Theme ─────────────────────────────────────────────────────────────────────

export type ColorMode = "light" | "dark";

// ── Table ─────────────────────────────────────────────────────────────────────

export type Order = "asc" | "desc";

// ── User (domain model) ───────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Inactive";
  createdAt: string;
}

// ── Column definition (generic table helper) ──────────────────────────────────

export interface Column<T = User> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  /**
   * Hide this column below the given MUI breakpoint.
   * "sm" → hidden on xs (< 600 px)
   * "md" → hidden on xs + sm (< 900 px)
   */
  hideBelow?: "sm" | "md";
}
