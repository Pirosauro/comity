# @comity/i18n — Conventions

`@comity/i18n` is a Core Module.

## Rules

- keep i18n semantics inside the module boundary
- expose hooks and setup contracts explicitly
- keep error normalization inside the module error layer
- depend only on the lower Comity layers already declared in `package.json`

