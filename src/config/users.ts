import type { Column, User } from "../types";

/**
 * COLUMNS
 * Defines which columns appear in the Users table and how they behave.
 * The `hideBelow` field controls responsive visibility — see Column type.
 */
export const COLUMNS: Column<User>[] = [
  { id: "id",        label: "ID",         minWidth: 50,  hideBelow: "sm"                     },
  { id: "name",      label: "Name",       minWidth: 140                                       },
  { id: "email",     label: "Email",      minWidth: 180, hideBelow: "md"                     },
  { id: "role",      label: "Role",       minWidth: 90,  align: "center", hideBelow: "sm"    },
  { id: "status",    label: "Status",     minWidth: 90,  align: "center"                     },
  { id: "createdAt", label: "Created At", minWidth: 120, align: "right",  hideBelow: "md"    },
];

/**
 * INITIAL_USERS
 * Seed data used for the demo.  Replace with an API call in production.
 */
export const INITIAL_USERS: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com",  role: "Admin",  status: "Active",   createdAt: "2024-01-15" },
  { id: 2, name: "Bob Martinez",  email: "bob@example.com",    role: "Editor", status: "Active",   createdAt: "2024-02-20" },
  { id: 3, name: "Carol White",   email: "carol@example.com",  role: "Viewer", status: "Inactive", createdAt: "2024-03-05" },
  { id: 4, name: "David Kim",     email: "david@example.com",  role: "Editor", status: "Active",   createdAt: "2024-03-18" },
  { id: 5, name: "Eva López",     email: "eva@example.com",    role: "Viewer", status: "Active",   createdAt: "2024-04-02" },
  { id: 6, name: "Frank Chen",    email: "frank@example.com",  role: "Admin",  status: "Inactive", createdAt: "2024-04-10" },
  { id: 7, name: "Grace Park",    email: "grace@example.com",  role: "Viewer", status: "Active",   createdAt: "2024-05-01" },
];

/** Shape of the create/edit form (excludes auto-generated fields). */
export type UserFormData = Omit<User, "id" | "createdAt">;

export const EMPTY_FORM: UserFormData = {
  name:   "",
  email:  "",
  role:   "Viewer",
  status: "Active",
};
