import { defineConfig } from "drizzle-kit";
import { resolve } from "path";

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  verbose: true,
  strict: true,
  schema: [
    // resolve("./node_modules/@comity/content/dist/database/index.js"),
    // resolve("./node_modules/@comity/slug/dist/database/index.js"),
    // resolve("./node_modules/@comity/workspace/dist/database/index.js"),
    // resolve("./node_modules/@comity/user/dist/database/index.js"),
    // resolve("./node_modules/@comity/slug/dist/database/index.js"),
    resolve("./node_modules/@comity/workspace/dist/cjs/database/index.js"),
  ],
  dbCredentials: {
    url: "postgres://root:qwerty@192.168.1.80:5432/example",
  },
});
