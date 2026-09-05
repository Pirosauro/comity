import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/*/vitest.config.{ts,js,mjs}",
    ],

    environment: "node",
    globals: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",

      include: ["packages/*/src/**/*.ts"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "**/src/**/index.ts",
      ],

      clean: true,
      cleanOnRerun: false,
    },

    testTimeout: 10000,
  },
});
