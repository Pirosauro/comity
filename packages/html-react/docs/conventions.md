# @comity/html-react — Conventions

`@comity/html-react` is an adapter package.

## Rules

- depend on `@comity/html`, `@comity/http`, and `@comity/primitives`
- keep React-specific details inside the adapter boundary
- do not own the HTML domain model
- keep renderers replaceable

