# @comity/acl

Lightweight ACL helpers and adapters for Comity use-cases.

This package provides small, testable helpers to perform subject- and
field-level access control checks from within application use-cases. It
does not implement policy storage; instead it defines an adapter interface
and ships a CASL-backed adapter to integrate with CASL `Ability` rules.

## Features

- Subject-level checks (`can`): allow/deny access to whole resources.
- Field-level checks (`filterReadableFields` / `filterWritableFields`): soft
  projections that limit which fields may be read or written.
- Small, focused helpers for common patterns: `createWithAcl`,
  `readWithAcl`, `updateWithAcl`, `deleteWithAcl`, and `listWithAcl`.
- A CASL adapter factory: `createCaslAclAdapter`.

## Installation

This package is part of the Comity monorepo. In typical usage you install
Comity packages from npm or use the monorepo workspace when developing.

Install with pnpm (example):

```bash
pnpm add @comity/acl
```

## Concepts

- AclAdapter: an interface that exposes subject- and field-level checks.
- Field validators: small helpers that validate/normalize requested field
  lists before they're used to compute projections.
- Helpers: small functions that orchestrate ACL checks and repository calls
  in a consistent, testable way.

## Quick usage

Example using CASL as the policy engine and the provided adapter:

```ts
import { AbilityBuilder, Ability } from "@casl/ability";
import { createCaslAclAdapter } from "@comity/acl/adapters/casl";
import {
  createWithAcl,
  readWithAcl,
  updateWithAcl,
  deleteWithAcl,
  listWithAcl,
} from "@comity/acl";

// Build a simple CASL ability (rules omitted for brevity)
const ability = new Ability([]);
const acl = createCaslAclAdapter({ ability, subject: "Post" });

// A minimal fields validator: ensures only known fields are requested
const fieldsValidator = (requested: readonly string[]) =>
  requested.filter((f) => ["id", "title", "body", "authorId"].includes(f));

// Create example — repository functions are application-specific
const created = await createWithAcl({
  acl,
  resource: { title: "Hello", body: "World", authorId: "u1" },
  create: async (payload) => ({ id: "1", ...payload }),
  fieldsValidator,
  requestedFields: ["id", "title"],
});

// Read example
const post = await readWithAcl({
  acl,
  resource: { id: "1" },
  read: async (id, fields) => ({ id, title: "Hello", body: "World" }),
  fieldsValidator,
  requestedFields: ["id", "body"],
});
```

Refer to the helper signatures in `packages/acl/src` for full options and
semantics. The helpers throw `ForbiddenError` when a subject-level ACL check
fails and `NotFoundError` when a backing repository cannot find or delete the
target resource; these error classes come from `@comity/core/errors`.

## API overview

- `createWithAcl(options)` — performs optional field-level projection and
  subject-level checks for creation flows, returning the created entity with
  readable fields only.
- `readWithAcl(options)` — validates requested fields, applies record-level
  subject checks and field projections, and returns the projected entity.
- `updateWithAcl(options)` — validates the requested writable fields,
  checks subject-level `update` permission, calls the repository updater,
  and projects the resulting entity to readable fields.
- `deleteWithAcl(options)` — checks subject-level `delete` permission and
  calls the repository removal function; throws `NotFoundError` if the
  repository reports the resource was not deleted.
- `listWithAcl(options)` — computes allowed fields, queries the repository
  with a projection, applies record-level filtering, and returns projected
  entities.
- `createCaslAclAdapter(options)` — adapter factory that forwards checks to
  a CASL `Ability` instance and supports field-level checks by asking CASL
  whether a particular field is allowed.

## Examples & testing

- See `packages/acl/src/__tests__` and `packages/acl/src/adapters/__tests__`
  for concrete usage examples and coverage-tested scenarios.

## Contributing

Follow the repository contributing guidelines. Docs-only changes (like this
README) should be accompanied by a short note in the PR describing what was
added and why.

## License

The package follows the repository license. See the top-level LICENSE file.
