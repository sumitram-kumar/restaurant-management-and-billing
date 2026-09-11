import { ComponentType } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

// Wraps a page component so an unauthenticated visitor is redirected through
// Auth0 login instead of every page hand-rolling an `isAuthenticated && (...)`
// guard (the original pattern, copy-pasted across nine components).
export function ProtectedRoute({ component }: { component: ComponentType }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>Loading...</div>,
  });
  return <Component />;
}
