# @comity/auth — Architecture

`@comity/auth` is organized around a domain core plus explicit policy and
runtime support layers.

## Main areas

- `contracts/` — stable auth and session abstractions
- `error/` — module error definitions
- `hooks/` — extension points for runtime composition
- `policies/` — assurance, refresh, and revocation rules
- `repositories/` — repository contracts and memory support
- `setup/` — kernel module metadata and wiring
- `use-cases/` — session lifecycle operations

## Architectural shape

The package keeps session semantics in the core and lets adapters handle
transport or persistence integration.

