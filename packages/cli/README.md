# @comity/cli

The `@comity/cli` package provides a plugin-based Command Line Interface framework for Comity-based projects: extensible command registration, lifecycle hooks, configuration management, and a shared CLI context.

This package is intended to be consumed by applications that need to build CLI tools with plugin architecture, command management, and extensible functionality.

## Features

- Plugin-based architecture for extensible CLI commands and hooks
- Type-safe configuration management with `defineConfig`
- Shared `CliContext` for command and hook management
- Automatic configuration loading from multiple file paths
- Lifecycle hooks for `beforeCommand` and `afterCommand` events
- Integration with Commander.js for robust CLI parsing
- Pino logger integration for consistent logging
- Duplicate registration prevention and error handling

## Quickstart

Install the monorepo (pnpm workspace):

```bash
pnpm install
```

Create a CLI configuration file:

```js
// comity.config.js
import { defineConfig } from "@comity/cli";

export default defineConfig({
  plugins: [
    {
      name: "@example/greeter",
      version: "1.0.0",
      commands: [
        {
          name: "greet",
          description: "Greet someone",
          options: [
            {
              flags: "--name <name>",
              description: "Name to greet",
              default: "World",
            },
          ],
          action: (options) => {
            console.log(`Hello, ${options.name}!`);
          },
        },
      ],
      hooks: {
        beforeCommand: ({ command }) => {
          console.log(`Executing command: ${command}`);
        },
        afterCommand: ({ command }) => {
          console.log(`Finished command: ${command}`);
        },
      },
    },
  ],
});
```

Run the CLI:

```bash
npx comity greet --name Alice
# Output: Executing command: greet
# Hello, Alice!
# Finished command: greet
```

## API

- `defineConfig<T>(config)`

  - Type-safe configuration helper that provides IDE autocompletion and compile-time validation for CLI configurations.
  - Returns the configuration object unchanged but with full TypeScript support.

- `CliContext`

  - Main CLI context class that manages plugins, commands, and hooks.
  - Constructor accepts a `CliConfig` object with optional logger, plugins, and global hooks.

- `CliContext.registerPlugin(plugin)`

  - Registers a plugin with its commands and hooks.
  - Throws an error if a plugin with the same name is already registered.

- `CliContext.registerCommand(command)`

  - Registers a single command.
  - Throws an error if a command with the same name already exists.

- `CliContext.registerHook(name, hook)`

  - Registers a hook function for a specific hook name.

- `CliContext.executeHook(name, context?)`

  - Executes all registered hooks for the given name asynchronously.
  - Errors in individual hooks are logged but don't stop execution of other hooks.

- `CliContext.getCommand(name)`

  - Returns a command by name or undefined if not found.

- `CliContext.getAllCommands()`

  - Returns an array of all registered commands.

## Plugin authoring

Create a plugin using the `CliPlugin` interface:

```ts
import type { CliPlugin } from "@comity/cli";

export const myPlugin: CliPlugin = {
  name: "@example/my-plugin",
  version: "1.0.0",
  commands: [
    {
      name: "build",
      description: "Build the project",
      options: [
        {
          flags: "--watch",
          description: "Watch for changes",
        },
        {
          flags: "--output <dir>",
          description: "Output directory",
          default: "dist",
        },
      ],
      action: async (options) => {
        console.log(`Building to ${options.output}...`);

        if (options.watch) {
          console.log("Watching for changes...");
        }
        // Build logic here
      },
    },
  ],
  hooks: {
    beforeCommand: async ({ command, args }) => {
      console.log(`Starting ${command} with args:`, args);
    },
    afterCommand: async ({ command }) => {
      console.log(`${command} completed successfully`);
    },
  },
};
```

### Built-in Hooks

- `beforeCommand`: Executed before any command runs
  - Context: `{ command: string, args: any[] }`
- `afterCommand`: Executed after any command completes
  - Context: `{ command: string, args: any[] }`

### Command Options

Commands support the following option properties:

- `flags`: Commander.js option flags (e.g., `--name <name>`, `-v`)
- `description`: Help text for the option
- `default`: Default value if not provided

## Configuration

The CLI automatically loads configuration from these paths (in order):

1. `comity.config.ts`
2. `comity.config.js`
3. `config/comity.config.ts`
4. `config/comity.config.js`

Configuration files should export a default `CliConfig` object:

```ts
import { defineConfig } from "@comity/cli";

export default defineConfig({
  logger: customLogger, // Optional Pino logger instance
  plugins: [
    /* plugin array */
  ],
  hooks: {
    beforeCommand: (context) => {
      // Global before hook
    },
  },
});
```

## Development & Tests

Run the package tests (from repository root):

```bash
pnpm -w -F @comity/cli test
```

Run the full monorepo test suite:

```bash
pnpm -w test
```

Linting and type checks are provided at the workspace level; run your usual tooling as needed.

## License

See the package `LICENSE` in the repository root.
