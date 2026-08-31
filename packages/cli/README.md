# @comity/cli

CLI abstraction module for Comity framework applications.

---

## Purpose

Defines the core CLI abstraction for Comity applications. Provides contracts for command registration, hook-based lifecycle, event-based observability, and execution context. This package contains no Commander.js or process/runtime dependencies — it is a pure TypeScript abstraction.

---

## Scope

This package:

- ✅ defines `CliCommand`, `CliOption`, `CliArgument`, `CliCommandContext`, `CliCommandArgs` contracts
- ✅ provides `CliRegistrationFacade` for command registration during setup
- ✅ provides `CommandRegistry` for command storage and validation
- ✅ provides `CliExecutionFacade` for command execution
- ✅ provides `createCliExecutionFacade` factory
- ✅ provides `CliError` for error handling
- ✅ defines `CliLifecycle` hooks (`beforeCommand`, `afterCommand`)

This package does NOT:

- ❌ include Commander.js or any CLI parsing library
- ❌ contain process/runtime integration (argv, exit codes, signals)
- ❌ include filesystem config discovery
- ❌ provide executable/bin entry point
- ❌ include concrete logger implementation
- ❌ define a persistent CLI lifecycle (no `start`/`stop`/`seal`)

---

## Public API

No exhaustive reference; see docs for constraints.

### Contracts

```typescript
// Command definition
type CliCommand<Context = {}> = {
  name: string;
  description?: string;
  arguments?: readonly CliArgument[];
  options?: readonly CliOption[];
  action: (args: CliCommandArgs, context: CliCommandContext<Context>) => void | Promise<void> | Result<void, BaseError>;
};

type CliArgument = { name: string; description?: string; required?: boolean };
type CliOption = { name: string; aliases?: readonly string[]; description?: string; required?: boolean; value?: boolean; default?: string | number | boolean };
type CliCommandArgs = Record<string, unknown>;
type CliCommandContext<Context = {}> = Readonly<Context>;

// Hooks
type CliCommandRun<Context = {}> = { name: string; args: CliCommandArgs; context: CliCommandContext<Context> };
type CliLifecycle<Context = {}> = { beforeCommand: CliCommandRun<Context>; afterCommand: CliCommandRun<Context> };
type CliHookHandler<Context = {}> = HookHandler<CliCommandRun<Context>>;

// Registration
interface CliRegistrationFacade<Context = {}> {
  registerCommand(command: CliCommand<Context>): void;
  commands(): readonly CliCommand<Context>[];
}

// Errors
class CliError extends BaseError { ... }
type CliErrorReason = "command_not_found" | "hook_failed" | "command_failed" | "usage";
type CliErrorMeta = { details?: Record<string, unknown>; cause?: unknown };
```

### Facade & Registry

```typescript
class CommandRegistry<Context = {}> {
  register(command: CliCommand<Context>): void;
  get(name: string): CliCommand<Context> | undefined;
  all(): readonly CliCommand<Context>[];
  has(name: string): boolean;
}

class CliExecutionFacade<Context = {}> {
  constructor(registry: CommandRegistry<Context>, hooks: HookBus<CliLifecycle<Context>>, events: EventBus<CliEvents<Context>>, context: Context);
  commands(): readonly CliCommand<Context>[];
  execute(name: string, args: CliCommandArgs): Promise<Result<void, CliError>>;
}

function createCliExecutionFacade<Context = {}>(
  registry: CommandRegistry<Context>,
  hooks: HookBus<CliLifecycle<Context>>,
  events: EventBus<CliEvents<Context>>,
  context: Context
): CliExecutionFacade<Context>;
```

### Events

```typescript
interface CliEvents<Context = {}> {
  "cli.command.started": { name: string; args: CliCommandArgs; context: CliCommandContext<Context> };
  "cli.command.completed": { name: string; args: CliCommandArgs; context: CliCommandContext<Context>; durationMs: number };
  "cli.command.failed": { name: string; args: CliCommandArgs; context: CliCommandContext<Context>; error: Error; durationMs: number };
}
```

### Errors

Error primitives and CLI-specific error types exported from `@comity/cli/errors`:

```typescript
class CliError extends BaseError { ... }
type CliErrorReason = "command_not_found" | "hook_failed" | "command_failed" | "usage";
type CliErrorMeta = { details?: Record<string, unknown>; cause?: unknown };
```

---

## Usage Pattern

The Application owns CLI composition:

```typescript
// cli.ts — Application layer
import { createApplication } from "./modules.js";
import { CommandRegistry, CliExecutionFacade } from "@comity/cli";
import { createCommanderAdapter } from "@comity/cli-commander";

async function main() {
  const kernel = await createApplication();

  // 1. Create registry
  const registry = new CommandRegistry<AppContext>();

  // 2. Explicitly invoke module CLI capabilities
  for (const module of [ordersModule, usersModule]) {
    module.registerCliCommands?.(registry);
  }

  // 3. Create execution context
  const appContext = createAppContext(kernel);

  // 4. Adapt shared Kernel buses to CLI-specific contracts
  const cliHooks = kernel.hooks as HookBus<CliLifecycle<AppContext>>;
  const cliEvents = kernel.events as EventBus<CliEvents>;

  // 5. Create execution facade
  const cli = new CliExecutionFacade(registry, cliHooks, cliEvents, appContext);

  // 6. Run via Commander adapter
  const adapter = createCommanderAdapter({ program, facade: cli });
  await adapter.run(process.argv.slice(2));

  await kernel.stop();
}
```

---

## Documentation

- [Overview](docs/overview.md)
- [Conventions](docs/conventions.md)

---

## Related Packages

- `@comity/primitives` — Result, Error, HookBus, EventBus, DI primitives
- `@comity/cli-commander` — Commander.js Technology Adapter
- Application layer — owns bin entry point and composition

---

## Status

Stable

_Implementation: 2026-08-31 (ADR-025)_

_Review Completed: 2026-08-30_
_Compliance Score: 100% (Green)_