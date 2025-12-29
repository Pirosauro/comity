# @comity/cli

Command Line Interface for the Comity framework.

`@comity/cli` provides a structured, extensible, and predictable CLI runtime built on top of the Comity core primitives. It is designed to be used both as a standalone developer tool and as a programmable CLI runtime for larger systems.

The module strictly follows Comity architectural principles:

- Clear separation between **bootstrap**, **runtime**, and **domain logic**
- Standardized **error model** based on `BaseError`
- Plugin-based command and hook registration
- No business or orchestration logic inside the `bin/` entrypoint

---

## Features

- **Composable CLI Runtime**

  - Central `CliContext` for command, hook, and plugin management

- **Plugin System**

  - Register commands, hooks, and extensions via plugins
  - Deterministic registration and conflict detection

- **Lifecycle Hooks**

  - `beforeCommand` / `afterCommand` hooks
  - Extensible hook registry

- **Configuration Loader**

  - Secure CLI configuration resolution
  - Path traversal protection

- **Standardized Errors**

  - All domain errors extend `BaseError`
  - Machine-readable error codes
  - HTTP-style semantics where applicable

---

## Installation

```sh
pnpm add @comity/cli
```

---

## CLI Entry Point

The executable entry point (`bin/index.ts`) is intentionally minimal and limited to:

- Parsing process arguments
- Invoking the CLI runtime
- Handling fatal errors

All runtime orchestration lives outside `bin/`.

```ts
#!/usr/bin/env node

import { run } from "../runtime/run.js";

run(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

---

## Runtime Architecture

```
cli/
├─ bin/
│  └─ index.ts        # Thin bootstrap only
├─ runtime/
│  ├─ context.ts      # CliContext (commands, hooks, plugins)
│  ├─ loader.ts       # Configuration loader
│  └─ run.ts          # Runtime entry
└─ errors/
   └─ *.ts            # CLI-specific BaseError extensions
```

---

## CliContext

`CliContext` is the core runtime container. It is responsible for:

- Registering commands
- Registering and executing hooks
- Registering plugins
- Exposing a read-only view of the runtime to adapters

Example:

```ts
const cli = new CliContext(config);

cli.registerCommand({
  name: "hello",
  description: "Say hello",
  action: async () => {
    console.log("Hello Comity");
  },
});
```

---

## Commands

Commands are plain objects with no dependency on Commander or other adapters.

```ts
export interface CliCommand {
  name: string;
  description?: string;
  options?: CliOption[];
  action: (...args: any[]) => Promise<void> | void;
}
```

This allows commands to be reused across different CLIs or adapters.

---

## Hooks

Hooks allow extending the CLI lifecycle.

Available hooks:

- `beforeCommand`
- `afterCommand`

Example:

```ts
cli.registerHook("beforeCommand", async ({ command }) => {
  console.log(`Running ${command}`);
});
```

Hooks are executed sequentially. Errors propagate as `BaseError` instances.

---

## Plugins

Plugins are first-class citizens.

```ts
export interface CliPlugin {
  name: string;
  commands?: CliCommand[];
  hooks?: Record<string, CliHook>;
}
```

Registering a plugin:

```ts
cli.registerPlugin(myPlugin);
```

Duplicate plugin names result in a `ConflictError`.

---

## Configuration Loading

Configuration is resolved by the runtime loader:

- Supports environment overrides
- Prevents path traversal
- Emits structured errors

Possible errors:

- `CliConfigNotFoundError`
- `CliConfigLoadError`
- `CliConfigInvalidError`

---

## Error Model

All CLI-specific errors extend `BaseError`.

Example:

```ts
export class CliConfigNotFoundError extends BaseError {
  readonly code = "CLI_CONFIG_NOT_FOUND";

  constructor(meta: { searchedPaths: string[]; cause?: unknown }) {
    super("CLI configuration file not found", {
      httpStatus: 400,
      ...meta,
    });
  }
}
```

### Error Handling Contract

- Domain errors are **thrown**, not logged
- Logging is performed at the runtime or bin boundary
- Errors carry structured metadata

---

## Commander Adapter

Commander is treated as an **adapter**, not a dependency of the domain.

Responsibilities:

- Map `CliCommand` to Commander commands
- Forward execution to `CliContext`
- Translate process arguments

This ensures the CLI runtime can be reused with different argument parsers.

---

## Design Principles

- **Thin bin**: no business logic in executable entrypoints
- **Explicit runtime boundary**
- **Framework-level error semantics**
- **Composable, testable units**

---

## Related Packages

- `@comity/core` – Core framework primitives

---

## License

MIT
