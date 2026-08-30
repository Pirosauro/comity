# @comity/cli

CLI abstraction module for Comity framework applications.

---

## Purpose

Defines the core CLI abstraction for Comity applications. Provides contracts for command registration, plugin composition, hook-based lifecycle, and configuration management. This package contains no Commander.js or process/runtime dependencies — it is a pure TypeScript abstraction.

---

## Scope

This package:

- ✅ defines `CliCommand`, `CliPlugin`, `CliHook`, `CliConfig` contracts
- ✅ provides `CliContext` for command/hook/plugin registration and execution
- ✅ provides `defineConfig` for type-safe configuration
- ✅ provides `CliConfigLoader` interface for configuration loading

This package does NOT:

- ❌ include Commander.js or any CLI parsing library
- ❌ contain process/runtime integration (argv, exit codes, signals)
- ❌ include filesystem config discovery
- ❌ provide executable/bin entry point
- ❌ include concrete logger implementation

---

## Public API
No exhaustive reference; see docs for constraints.

No exhaustive reference; see docs for constraints.

### Types

```typescript
// Command definition
type CliCommand = {
  name: string;
  description?: string;
  action: (args: CliCommandArgs, context: CliCommandContext) => void | Promise<void>;
  options?: CliOption[];
};

type CliOption = { flags: string; description?: string; default?: unknown };
type CliCommandArgs = Record<string, unknown>;
type CliCommandContext = { config: CliConfig; logger: Logger };

// Hooks
type CliHook = (context: HookContext) => void | Promise<void>;
type HookContext = { commandName: string; args: CliCommandArgs; config: CliConfig; logger: Logger };

// Plugins
type CliPlugin = { name: string; version: string; commands?: CliCommand[]; hooks?: Record<string, CliHook> };

// Configuration
interface CliConfig { logger?: Logger; plugins?: CliPlugin[]; hooks?: Record<string, CliHook>; workingDirectory?: string; }
interface Logger { info(message: string, meta?: Record<string, unknown>): void; error(message: string, meta?: Record<string, unknown>): void; debug(message: string, meta?: Record<string, unknown>): void; }

// Context interface
interface CliContextInterface {
  registerCommand(command: CliCommand): void;
  registerHook(name: string, hook: CliHook): void;
  executeHook(name: string, context: HookContext): Promise<void>;
  getCommand(name: string): CliCommand | undefined;
  getAllCommands(): CliCommand[];
}

// Configuration loader abstraction
interface CliConfigLoader { load(): Promise<CliConfig>; }
```

### Core Implementation

```typescript
class CliContext implements CliContextInterface {
  registerCommand(command: CliCommand): void;
  registerHook(name: string, hook: CliHook): void;
  async executeHook(name: string, context: HookContext): Promise<void>;
  getCommand(name: string): CliCommand | undefined;
  getAllCommands(): CliCommand[];
}

function defineConfig<T extends CliConfig>(config: T): T;
```

### Plugin Registration

Plugins bundle commands and hooks:

```typescript
const plugin = {
  name: "my-plugin",
  version: "1.0.0",
  commands: [{ name: "cmd", action: async () => {} }],
  hooks: { beforeCommand: async (ctx) => {} },
};
context.registerPlugin(plugin);
```

### Configuration

```typescript
const config = defineConfig<CliConfig>({
  logger: myLogger,
  plugins: [myPlugin],
  hooks: { beforeCommand: async (ctx) => {} },
});
```

---

## Documentation

- [Overview](docs/overview.md)
- [Conventions](docs/conventions.md)

---

## Related Packages

- `@comity/primitives` — Result, Error, HookBus, DI primitives
- `@comity/cli-commander` — Commander.js Technology Adapter
- Application layer — owns bin entry point and composition

---

## Status

Stable

_Review Completed: 2026-08-30_
_Compliance Score: 100% (Green)_