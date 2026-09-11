import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAccessTokenGetter } from "../api/httpClient";

// Mounted once near the root. axios interceptors run outside React and can't
// call hooks directly, so this pushes Auth0's token getter into httpClient's
// module state whenever auth status changes.
export function AuthTokenBridge() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setAccessTokenGetter(() => getAccessTokenSilently());
    } else {
      setAccessTokenGetter(async () => undefined);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
}
