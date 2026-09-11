import { config } from "dotenv";
import { execSync } from "node:child_process";
import path from "node:path";

// Runs once, before any test file/worker is spawned. Loads .env.test
// (overriding whatever .env holds) and applies migrations to the test
// database, so `npm test` works the same way locally and in CI as long
// as .env.test points at a reachable, disposable MySQL database.
export default function setup() {
  config({ path: path.resolve(__dirname, "../.env.test"), override: true });
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
