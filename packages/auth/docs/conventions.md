# @comity/auth — Conventions

`@comity/auth` is a Core Module.

## Rules

- keep authentication semantics inside the module boundary
- expose contracts, policies, hooks, repositories, and use cases explicitly
- keep transport and persistence concerns out of the public API
- normalize failures through the module error type exported from `./error`

## Layering

- may depend on `@comity/primitives`
- may depend on `@comity/kernel` when runtime hooks are needed
- must not depend on adapters or applications

