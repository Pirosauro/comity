# Architecture

@comity/sql follows the standard Comity layering model.

```text
┌─────────────────────────────┐
│           App               │
│  - repositories             │
│  - use cases                │
│                             │
│  wires concrete adapter     │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│        @comity/sql          │
│        (this module)        │
│                             │
│  - SqlClient contract       │
│  - SqlTransaction contract  │
│  - SqlError semantics       │
│  - Result types             │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│        SQL Adapters         │
│  (drizzle / pg / kysely)    │
│                             │
│  - translate driver errors  │
│  - manage connections       │
│  - implement transactions   │
└─────────────────────────────┘
```

## Key rules

@comity/sql never imports database drivers.
Database drivers never import application code.
