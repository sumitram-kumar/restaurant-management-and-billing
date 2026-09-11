import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../lib/AppError";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A record with these details already exists" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Record not found" });
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // express-oauth2-jwt-bearer throws its own UnauthorizedError/InvalidTokenError
  // classes (not AppError) for a missing/expired/malformed token. Rather than
  // import and enumerate them, treat anything shaped like one of Express's own
  // HTTP errors (a numeric statusCode) the same way.
  if (
    err instanceof Error &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number"
  ) {
    const statusCode = (err as { statusCode: number }).statusCode;
    return res.status(statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
};
