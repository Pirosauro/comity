import { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/old/**",
    ],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "coverage/**", "src/**/index.ts", "old/**"],
    },
  },
});
