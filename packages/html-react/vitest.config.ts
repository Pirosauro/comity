import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@comity/html-react": resolve(__dirname, "./src"),
    },
  },
});