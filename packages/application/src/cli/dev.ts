import { createServer } from "vite";

/**
 * Starts the Comity application development server with hot module replacement.
 *
 * @param configFile - Optional path to a custom Vite configuration file
 *
 * @remarks
 * This command launches Vite's development server with hot module replacement (HMR)
 * for rapid development and testing of Comity applications. The server provides
 * fast rebuilds and browser refresh on file changes.
 *
 * **Development Features:**
 * - **Hot Module Replacement**: Instant updates without full page reloads
 * - **Source Maps**: Enhanced debugging with original source code mapping
 * - **Error Overlay**: Clear error messages and stack traces in the browser
 * - **CLI Shortcuts**: Keyboard shortcuts for common development actions
 *
 * **Server Configuration:**
 * Uses the Vite configuration file specified by `configFile` parameter,
 * or falls back to default Vite discovery. The server automatically
 * prints available URLs and development shortcuts on startup.
 *
 * @example
 * Start development server
 * ```bash
 * npx comity dev
 * ```
 *
 * @example
 * Development server with custom config
 * ```bash
 * npx comity dev --config vite.config.dev.ts
 * ```
 *
 * @example
 * Development script in package.json
 * ```json
 * {
 *   "scripts": {
 *     "dev": "comity dev",
 *     "start": "comity dev"
 *   }
 * }
 * ```
 */
export async function devCommand(configFile?: string) {
  const server = await createServer({
    configFile,
  });

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
