import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:5000";

export const httpClient = axios.create({ baseURL: `${baseURL}/api` });

// axios interceptors can't call React hooks, so AuthTokenBridge (mounted once
// near the root) pushes Auth0's token getter in here after login, and every
// request reads it fresh — the token is short-lived and auto-refreshed by the
// Auth0 SDK, so we can't just capture it once.
type TokenGetter = () => Promise<string | undefined>;
let getAccessToken: TokenGetter | undefined;

export function setAccessTokenGetter(getter: TokenGetter) {
  getAccessToken = getter;
}

httpClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
