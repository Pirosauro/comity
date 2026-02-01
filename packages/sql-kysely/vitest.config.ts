import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "coverage/**", "src/**/index.ts"],
      reporter: ["text", "json", "html"],
    },
  },
});
