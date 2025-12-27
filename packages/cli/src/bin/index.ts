#!/usr/bin/env node

import { Command } from "commander";
import { CliContext } from "./context.js";
import { loadCliConfig } from "./utils/loader.js";

const version = "1.0.0"; // Ideally, this should be dynamically set from package.json or an environment variable

async function main() {
  try {
    // Load configuration
    const config = await loadCliConfig();
    // Initialize core
    const cli = new CliContext(config);
    // Create the commander application
    const program = new Command();

    program.name("Comity CLI").version(version);

    // Register all commands
    cli.getAllCommands().forEach((command) => {
      const cmd = program.command(command.name);

      if (command.description) {
        cmd.description(command.description);
      }

      // Add options
      command.options?.forEach((option) => {
        cmd.option(option.flags, option.description, option.default);
      });

      // Add action
      cmd.action(async (...args) => {
        await cli.executeHook("beforeCommand", { command: command.name, args });
        await command.action(...args);
        await cli.executeHook("afterCommand", { command: command.name, args });
      });
    });

    // Parse arguments
    program.parse(process.argv);
  } catch (error) {
    console.error("Error during CLI execution:", error);
    process.exit(1);
  }
}

main();
