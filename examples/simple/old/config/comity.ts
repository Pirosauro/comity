import { defineConfig } from "@comity/cli";
import postgres from "@comity/postgres/cli";

export default defineConfig({
  plugins: [postgres],
});
