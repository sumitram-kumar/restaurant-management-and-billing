import "./lib/bigintJson";
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { apiRouter } from "./routes";
import { requireAuth } from "./middleware/auth";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(pinoHttp({ logger }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Everything under /api is staff-only billing data — require a valid Auth0
// access token for the whole surface rather than picking routes to protect.
app.use("/api", requireAuth, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
