# @comity/catalog — Conventions

`@comity/catalog` is a domain/core support package.

## Rules

- keep public contracts explicit and minimal
- do not add persistence or rendering logic
- keep setup tokens and module types in the public boundary when needed
- depend only on the packages already declared in `package.json`

