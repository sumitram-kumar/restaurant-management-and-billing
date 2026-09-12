import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmFn | undefined>(undefined);

// A promise-based replacement for window.confirm() that renders as a real,
// themed dialog instead of a native browser popup. resolveRef holds the
// Promise's resolve function between opening the dialog and the user
// clicking a button, since the dialog's own open/close state and the
// confirm() call's return value are on different sides of an async gap.
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<(value: boolean) => void>();

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = (result: boolean) => {
    resolveRef.current?.(result);
    setOptions(null);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <Dialog
        open={options !== null}
        onClose={() => handleClose(false)}
        maxWidth="xs"
        fullWidth
      >
        {options && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{options.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{options.message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={() => handleClose(false)} color="inherit">
                {options.cancelText ?? "Cancel"}
              </Button>
              <Button
                onClick={() => handleClose(true)}
                variant="contained"
                color={options.danger ? "error" : "primary"}
                autoFocus
              >
                {options.confirmText ?? "Confirm"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context;
}
