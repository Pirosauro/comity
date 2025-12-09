import { createServer } from "vite";

/**
 * Starts the Vite development server with hot module replacement.
 *
 * @param configFile - Optional path to Vite config file
 */
export async function devCommand(configFile?: string) {
  const server = await createServer({
    configFile,
  });

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
