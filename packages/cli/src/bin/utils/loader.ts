import type { CliConfig } from "../../types.js";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export async function loadCliConfig(): Promise<CliConfig> {
  try {
    process.loadEnvFile?.(); // Load .env files if the environment supports it
  } catch {
    // Ignore errors during .env loading
  }

  const root = process.cwd();
  const paths = [
    resolve(root, "comity.config.ts"),
    resolve(root, "comity.config.js"),
    resolve(root, "config", "comity.ts"),
    resolve(root, "config", "comity.js"),
    resolve(root, "src", "config", "comity.ts"),
    resolve(root, "src", "config", "comity.js"),
  ];

  // Add environment variable overrides
  if (process.env.COMITY_CLI_CONFIG_FILE) {
    const path = resolve(root, process.env.COMITY_CLI_CONFIG_FILE);

    if (!path.startsWith(root)) {
      throw new Error(
        "Path Traversal detected: 'COMITY_CLI_CONFIG_FILE' must resolve within the current working directory."
      );
    }

    paths.unshift(path);
  }

  // Vite-specific environment variable override
  if (process.env.VITE_COMITY_CLI_CONFIG_FILE) {
    const path = resolve(root, process.env.VITE_COMITY_CLI_CONFIG_FILE);

    if (!path.startsWith(root)) {
      throw new Error(
        "Path Traversal detected: 'VITE_COMITY_CLI_CONFIG_FILE' must resolve within the current working directory."
      );
    }

    paths.unshift(process.env.VITE_COMITY_CLI_CONFIG_FILE);
  }

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
