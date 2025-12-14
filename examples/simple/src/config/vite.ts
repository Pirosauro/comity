import { defineConfig } from "vite";
import honoDevServerPlugin from "@hono/vite-dev-server";
import honoDevServerCloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import honoViteBuildCloudflarePagesPlugin from "@hono/vite-build/cloudflare-pages";
import { withComity } from "@comity/application/vite";

export default defineConfig(({ mode }) => {
  const comity = withComity({
    allowedOverrides: ["@comity/auth"],
  });

  if (mode === "client") {
    return {
      ...comity,
      build: {
        rollupOptions: {
          input: ["./src/client.ts"],
          output: {
            entryFileNames: "static/client.js",
            chunkFileNames: "static/assets/[name]-[hash].js",
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
        emptyOutDir: true,
      },
      plugins: [],
    };
  }

  return {
    ...comity,
    plugins: [
      honoDevServerPlugin({
        entry: "./src/server.ts",
        adapter: honoDevServerCloudflareAdapter,
      }),
      honoViteBuildCloudflarePagesPlugin({
        entry: "./src/server.ts",
      }),
    ],
  };
});
