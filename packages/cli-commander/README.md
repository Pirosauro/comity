# @comity/cli-commander

Commander.js Technology Adapter for @comity/cli.

---

## Purpose

Binds the `@comity/cli` Core Module abstraction to Commander.js, providing concrete implementation for command-line argument parsing, help generation, version handling, and process integration.

---

## Scope

This package:

- ✅ implements `@comity/cli` contracts using Commander.js
- ✅ provides `createCommanderAdapter` factory
- ✅ handles argv parsing, option mapping, help/version
- ✅ manages process integration (exit codes, signals)
- ✅ executes Core hooks around command execution

This package does NOT:

- ❌ define CLI contracts (those are in `@comity/cli`)
- ❌ contain business logic or domain logic
- ❌ own the executable/bin entry point (belongs to Application)

---

## Public API

No exhaustive reference; see docs for constraints.

```typescript
interface CommanderAdapterOptions<Context = {}> {
  /** Application-owned Commander program (name, version, help, output) */
  program: Command;

  /** Core CLI execution facade to translate and execute */
  facade: CliExecutionFacade<Context>;
}

function createCommanderAdapter<Context = {}>(options: CommanderAdapterOptions<Context>): {
  run(argv?: string[]): Promise<number>;
};
```

### Usage

```typescript
import { Command } from "commander";
import { CommandRegistry, CliExecutionFacade } from "@comity/cli";
import { createCommanderAdapter } from "@comity/cli-commander";

const registry = new CommandRegistry<AppContext>();
// ... register commands via module.registerCliCommands(registry) ...

const cliHooks = kernel.hooks as HookBus<CliLifecycle<AppContext>>;
const cliEvents = kernel.events as EventBus<CliEvents>;
const appContext = createAppContext(kernel);

const facade = new CliExecutionFacade(registry, cliHooks, cliEvents, appContext);

const program = new Command().name("myapp").version("1.0.0");
const adapter = createCommanderAdapter({ program, facade });

await adapter.run(process.argv.slice(2));
```

### Exit Codes

| Code | Meaning                       |
| ---- | ----------------------------- |
| 0    | Success                       |
| 1    | Command error / exception     |
| 2    | Unknown command / usage error |

---

## Documentation

- [Overview](docs/overview.md)
- [Conventions](docs/conventions.md)

---

## Related Packages

- `@comity/cli` — Core CLI abstraction (Core Module)
- `commander` — Underlying CLI parsing library (peer dependency)
- Application layer — owns bin entry point and composition

---

## Status

Stable

_Implementation: 2026-08-31 (ADR-025)_

_Review Completed: 2026-08-30_
_Compliance Score: 100% (Green)_