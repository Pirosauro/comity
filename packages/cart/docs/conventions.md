# @comity/cart — Conventions

`@comity/cart` behaves like a compact core/domain support package.

## Rules

- keep contracts and models explicit
- keep error types inside the `error` subpath
- depend only on the packages already declared in `package.json`
- do not add persistence or transport logic

