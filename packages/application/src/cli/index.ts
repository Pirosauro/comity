import type { CliPlugin } from "@comity/cli";
import { buildCommand } from "./build.js";
import { devCommand } from "./dev.js";

/**
 * CLI plugin for @comity/application providing build and development commands.
 *
 * @remarks
 * This plugin integrates with the @comity/cli system to provide essential
 * commands for building and developing Comity applications. It leverages Vite
 * for fast development and optimized production builds.
 *
 * **Provided Commands:**
 * - **build**: Compiles the application for production deployment
 * - **dev**: Starts the development server with hot module replacement
 *
 * **Integration:**
 * The plugin automatically detects and uses Vite configuration files,
 * supporting custom build setups and development workflows.
 *
 * @example
 * Using the CLI commands
 * ```bash
 * # Start development server
 * npx comity dev
 *
 * # Build for production
 * npx comity build
 *
 * # Use custom Vite config
 * npx comity dev --config vite.config.custom.ts
 * ```
 */
const plugin: CliPlugin = {
  name: "@comity/application",
  version: "1.0.0",
  commands: [
    {
      name: "build",
      description: "Build the application",
      action: buildCommand,
    },
    {
      name: "dev",
      description: "Start the development server",
      action: devCommand,
    },
  ],
  hooks: {},
};

export default plugin;
