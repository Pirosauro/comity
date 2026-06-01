import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "coverage/**", "src/**/index.ts"],
    },
  },
});
