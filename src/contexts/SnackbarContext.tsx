import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Snackbar, Alert } from "@mui/material";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarContextValue {
  /** Show a toast notification. */
  showSnackbar: (message: string, severity?: Severity) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useSnackbar
 * Call showSnackbar() from anywhere inside <SnackbarProvider>.
 */
export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used inside <SnackbarProvider>");
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * SnackbarProvider
 * Renders a single MUI Snackbar at the app root so any feature can trigger
 * a toast without managing its own Snackbar state.
 */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen]         = useState(false);
  const [message, setMessage]   = useState("");
  const [severity, setSeverity] = useState<Severity>("success");

  const showSnackbar = useCallback(
    (msg: string, sev: Severity = "success") => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
