import { ComponentType } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { AppShell } from "../layout/AppShell";

function FullPageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// Wraps a page component so an unauthenticated visitor is redirected through
// Auth0 login instead of every page hand-rolling an `isAuthenticated && (...)`
// guard (the original pattern, copy-pasted across nine components), and gives
// every authenticated page the shared sidebar/top-bar shell automatically.
export function ProtectedRoute({
  component,
  title,
}: {
  component: ComponentType;
  title: string;
}) {
  const Component = withAuthenticationRequired(
    (props: Record<string, unknown>) => {
      const Inner = component;
      return (
        <AppShell title={title}>
          <Inner {...props} />
        </AppShell>
      );
    },
    { onRedirecting: FullPageLoader }
  );
  return <Component />;
}
