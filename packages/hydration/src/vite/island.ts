import type { Plugin } from "vite";
import type { IslandMetadata } from "./types.js";
import { join } from "path";
import { simpleHash } from "./utils/hash.js";

export type Options = {
  root?: string;
  pattern?: RegExp;
};

export function comityIslandMetadataPlugin(options: Options = {}): Plugin {
  const { root = join(process.cwd(), "src"), pattern = /\.island\.[jt]sx?$/ } =
    options;

  return {
    name: "comity-island-metadata-vite-plugin",
    enforce: "pre",

    async load(id) {
      if (id.endsWith("?meta")) {
        id = id.replace("?meta", "");

        if (pattern.test(id)) {
          const metadata: IslandMetadata = {
            id: simpleHash(id),
          };

          return `export default ${JSON.stringify(metadata)};`;
        }
      }

      return null;
    },
  };
}
