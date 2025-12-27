import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.{ts,js,mjs}"],

    environment: "node",
    globals: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",

      clean: true,
      cleanOnRerun: false,

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    testTimeout: 10000,
  },
});
