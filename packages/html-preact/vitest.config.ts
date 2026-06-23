import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "coverage/**", "src/**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@comity/html-preact": resolve(__dirname, "./src"),
    },
  },
});
