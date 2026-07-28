# @comity/cache-kv — Conventions

`@comity/cache-kv` is an adapter package.

## Rules

- depend on `@comity/cache`, `@comity/kernel`, `@comity/composition`, and `@comity/primitives`
- keep store wiring inside `setup/`
- do not expose a domain-specific public error contract
- keep the package replaceable

