import type { Cli } from "./cli.js";

/**
 * CLI plugin contract.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @param cli - The composing CLI instance
 *
 * @remarks
 * A plugin is a setup function invoked at registration time with the
 * composing `Cli` instance. Plugins contribute commands, hooks, and other
 * plugins through the `Cli` facade. Composition is explicit: registration
 * order is invocation order, and there is no self-registered plugin state.
 */
export type CliPlugin<Context = {}> = (cli: Cli<Context>) => void;
