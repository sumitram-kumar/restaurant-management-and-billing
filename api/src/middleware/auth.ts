import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../config/env";

// Verifies the RS256 access token Auth0 issues for this API's audience.
// Applied to everything under /api except /health (see app.ts).
export const requireAuth = auth({
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
});
