#!/usr/bin/env node

import { pino } from "pino";
import { run } from "../runtime/run.js";

/**
 * Main entry point for the Comity CLI application.
 *
 * @remarks
 * This function initializes the CLI with proper error handling and logging.
 * It creates a Pino logger instance and delegates to the core CLI runner.
 * Any errors during CLI execution are logged and cause the process to exit with code 1.
 *
 * @example
 * Running from command line
 * ```bash
 * node bin/index.js build --watch
 * ```
 *
 * @example
 * Programmatic usage (not recommended for production)
 * ```typescript
 * import { main } from "./bin/index.js";
 * main(); // This will use process.argv
 * ```
 */
function main() {
  const logger = pino({ name: "@comity/cli" });

  run(process.argv).catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}

main();
