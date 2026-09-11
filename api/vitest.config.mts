import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./test/globalSetup.ts",
    include: ["test/**/*.test.ts"],
    // Integration tests share one MySQL database and truncate tables between
    // cases, so test files must not run concurrently against it.
    fileParallelism: false,
    hookTimeout: 20000,
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
    },
  },
});
