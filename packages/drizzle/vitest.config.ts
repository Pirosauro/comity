import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "src/**/index.ts",
        "src/**/types.ts",
      ],
    },
  },
});
