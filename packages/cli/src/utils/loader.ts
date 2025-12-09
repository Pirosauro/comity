import { CliConfig } from "../types.js";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

export async function loadCliConfig(): Promise<CliConfig> {
  const paths = [
    join(process.cwd(), "comity.config.ts"),
    join(process.cwd(), "comity.config.js"),
    join(process.cwd(), "config", "comity.config.ts"),
    join(process.cwd(), "config", "comity.config.js"),
  ];

  // Try to load the configuration file from the possible paths
  for (const path of paths) {
    try {
      const url = pathToFileURL(path).href;
      const { default: config } = await import(url);

      if (config) {
        return config;
      }
    } catch (error) {
      continue;
    }
  }

  // If no config file is found, throw an error
  throw new Error(
    "No configuration file found. Please create a comity.config.ts or comity.config.js file."
  );
}
