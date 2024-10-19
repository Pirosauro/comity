import type { Plugin } from "vite";

type Options = {
  entrypoint: string;
  jsxImportSource?: string;
  assetsDir?: string;
};

export default (options: Options): Plugin => {
  return {
    name: "@comity/vite-client",

    // config
    config: () => {
      return {
        build: {
          rollupOptions: {
            input: [options?.entrypoint],
          },
          assetsDir: options?.assetsDir ?? "static",
          manifest: true,
        },
        esbuild: {
          jsxImportSource: options?.jsxImportSource ?? "hono/jsx/dom",
        },
      };
    },
  };
};
