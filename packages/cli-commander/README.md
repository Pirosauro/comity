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
- ✅ implements filesystem config loader (`CliConfigLoader`)
- ✅ executes Core hooks around command execution

This package does NOT:

- ❌ define CLI contracts (those are in `@comity/cli`)
- ❌ contain business logic or domain logic
- ❌ own the executable/bin entry point (belongs to Application)

---

## Public API

No exhaustive reference; see docs for constraints.

```typescript
interface CommanderAdapterOptions {
  name: string; // CLI program name
  version: string; // CLI program version
  context: CliContext; // Core CliContext instance
  configLoader?: CliConfigLoader; // Optional config loader (default: FS loader)
  logger?: Logger; // Optional logger override
}

function createCommanderAdapter(options: CommanderAdapterOptions): {
  run: (argv?: string[]) => Promise<number>;
};

// Convenience factory with default filesystem config loader
function createCommanderAdapterWithDefaults(
  options: Omit<CommanderAdapterOptions, "configLoader"> & { context: CliContext }
): ReturnType<typeof createCommanderAdapter>;
```

### Usage

```typescript
import { CliContext } from "@comity/cli";
import { createCommanderAdapter } from "@comity/cli-commander";

const context = new CliContext(config);
context.registerCommand({ name: "build", action: async () => {} });

const adapter = createCommanderAdapter({
  name: "my-cli",
  version: "1.0.0",
  context,
});

await adapter.run(); // Uses process.argv.slice(2) by default
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

_Review Completed: 2026-08-30_
_Compliance Score: 100% (Green)_
