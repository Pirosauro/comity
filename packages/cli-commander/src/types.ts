import type { CliConfig, CliConfigLoader, Logger, CliContext } from "@comity/cli";

/**
 * Options for creating a Commander adapter.
 */
export interface CommanderAdapterOptions {
  /** CLI program name (e.g., "comity") */
  name: string;
  /** CLI program version */
  version: string;
  /** CliContext instance from @comity/cli */
  context: CliContext;
  /** Optional config loader (default: filesystem loader) */
  configLoader?: CliConfigLoader;
  /** Optional logger override */
  logger?: Logger;
}