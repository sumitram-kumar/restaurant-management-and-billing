import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  AUTH0_AUDIENCE: z.string().min(1),
  AUTH0_ISSUER_BASE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
