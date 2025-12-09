import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*"],
    include: ["packages/*/src/**/*.test.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{git,cache,output,temp}/**",
    ],
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",
      exclude: [
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/*.d.ts",
        "**/*.config.{ts,js}",
        "**/test{,s}/**",
        "**/*.test.{ts,tsx,js,jsx}",
        "**/*.spec.{ts,tsx,js,jsx}",
      ],
      all: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
});
