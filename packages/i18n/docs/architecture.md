# @comity/i18n — Architecture

`@comity/i18n` is organized around locale resolution, translation loading, and
facade-level access.

## Main areas

- `contracts/` — locale, loader, resolver, and translator contracts
- `error/` — i18n error definitions
- `hooks/` — runtime extension points
- `setup/` — module metadata and configuration wiring
- `facade.ts` — public facade surface

## Architectural note

The package keeps translation semantics in the core and delegates any concrete
translation source or runtime integration to lower-level composition.

