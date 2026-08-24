# @comity/catalog — Conventions

`@comity/catalog` is a domain/core module.

## Rules

- catalog owns product definition only; never commercial execution
- keep public contracts explicit and minimal
- do not add persistence or rendering logic
- keep setup tokens and module types in the public boundary
- depend only on the packages already declared in `package.json`
- prefer `Result<T, E>` and pure functions over exceptions for domain logic
- product `type` is opaque metadata; never introduce concrete product classes