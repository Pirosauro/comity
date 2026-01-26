import honoViteBuildCloudflarePagesPlugin from "@hono/vite-build/cloudflare-pages";
import honoDevServerPlugin from "@hono/vite-dev-server";
import honoDevServerCloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
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
    plugins: [
      honoDevServerPlugin({
        entry: "./src/server.tsx",
        adapter: honoDevServerCloudflareAdapter,
      }),
      honoViteBuildCloudflarePagesPlugin({
        entry: "./src/server.tsx",
      }),
    ],
  };
});
