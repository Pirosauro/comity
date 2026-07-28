# @comity/i18n-typesafe — Conventions

`@comity/i18n-typesafe` is an adapter/integration package.

## Rules

- depend on `@comity/i18n`, `@comity/kernel`, `@comity/composition`, and `@comity/primitives`
- keep `typesafe-i18n` integration details inside the package
- do not redefine the i18n domain
- keep public exports limited to setup interfaces and setup wiring
