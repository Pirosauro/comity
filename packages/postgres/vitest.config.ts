import { defineConfig } from "vitest/config";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "coverage/**", "src/**/index.ts"],
    },
  },
});
