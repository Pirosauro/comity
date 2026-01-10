# ACL Model

## Overview

Comity adopts an explicit, composable, and framework-agnostic Access Control Layer (ACL) model. The goal is to provide **strong authorization guarantees**, **excellent developer experience (DX)**, and **clear separation of concerns** between:

- **Validation** (what is structurally allowed)
- **Authorization** (what the actor is allowed to do)
- **Persistence** (how data is stored and retrieved)

The ACL model is designed to work across web APIs, SaaS backends, CLIs, and background workers.

---

## Core Principles

### 1. Validation ≠ Authorization

ACL never validates _structure_.

| Concern             | Responsibility |
| ------------------- | -------------- |
| Field existence     | Use case (Zod) |
| Field types         | Use case (Zod) |
| Business invariants | Use case       |
| Permissions         | ACL            |

**Invalid input is not a permission error.**

---

### 2. ACL Is Domain-Agnostic

ACL helpers and adapters:

- do **not** know database schemas
- do **not** know DTOs
- do **not** depend on ORM or validation libraries

They operate on:

- resources (plain objects)
- actions (`read | create | update | delete`)
- fields (strings)

---

### 3. Field-Level and Subject-Level ACL

Comity distinguishes two authorization layers:

1. **Field-level ACL**

   - Which fields may be read or written

2. **Subject-level ACL**

   - Whether the action is allowed on the resource instance

Both are required for correctness and security.

---

## ACL Adapter

The ACL adapter is the core abstraction.

```ts
export type AclAction = "read" | "create" | "update" | "delete";

export interface AclAdapter<E extends Record<string, any>> {
  /** Logical resource type (Organization, Tenant, Workspace, ...) */
  readonly resourceType: string;

  /** Field-level authorization */
  filterReadableFields(
    action: AclAction,
    resource: E,
    fields: readonly string[]
  ): readonly string[];

  /** Subject-level authorization */
  can(action: AclAction, resource: E): boolean;
}
```

### Why an Adapter?

- Avoids locking Comity to a specific ACL engine
- Enables CASL, RBAC, ABAC, or custom policies
- Keeps `@comity/core` independent

---

## CASL Adapter Example

```ts
import { subject } from "@casl/ability";

export function createCaslAclAdapter<R extends object>(options: {
  ability: AnyAbility;
  subject: string;
}): AclAdapter<R> {
  return {
    resourceType: options.subject,

    filterReadableFields(action, resource, fields) {
      return fields.filter((field) =>
        options.ability.can(action, subject(options.subject, resource), field)
      );
    },

    can(action, resource) {
      return options.ability.can(action, subject(options.subject, resource));
    },
  };
}
```

CASL remains an **adapter dependency**, never a core dependency.

---

## ACL Helpers

ACL helpers encapsulate common authorization flows.

They:

- receive validated input
- apply ACL rules
- call repositories
- throw standard Comity errors

### Example: `readWithAcl`

```ts
const organization = await readWithAcl({
  acl,
  resource: { id },
  requestedColumns,
  mandatoryColumns: ["id"],
  columnsSchema: organizationColumnsSchema,
  read: (fields) => repository.read(id, fields),
});
```

### Guarantees

- No unauthorized fields returned
- Minimal database queries
- Precise error semantics

---

## Error Semantics

ACL helpers always throw **standard Comity errors**.

### Forbidden

```ts
throw new ForbiddenError("Not allowed", {
  action: "read",
  subject: acl.resourceType,
  id: resource.id,
  fields,
});
```

Used when:

- action is not permitted
- no writable/readable fields

---

### Not Found

```ts
throw new NotFoundError("Resource not found", {
  action: "read",
  subject: acl.resourceType,
  id: resource.id,
});
```

Used when:

- resource does not exist
- result set is empty after query

---

## Why Zod Is Not in the Adapter

Zod validates **what exists**.
ACL validates **what is allowed**.

Keeping them separate:

- improves DX
- improves error clarity
- avoids leaking domain knowledge into ACL

---

## Lists and Soft ACL

For list operations:

- Field-level ACL is applied **before querying**
- Subject-level ACL is applied **after querying**

```ts
return results.filter((entity) => acl.can("read", entity));
```

This approach:

- avoids N+1 permission checks
- supports pagination and filtering

---

## Package Placement

Recommended structure:

```
@comity/acl
├─ adapters/
│  └─ casl.ts
├─ helpers/
│  ├─ readWithAcl.ts
│  ├─ createWithAcl.ts
│  ├─ updateWithAcl.ts
│  └─ deleteWithAcl.ts
├─ types.ts
```

`@comity/core` remains dependency-free.

---

## Summary

- ACL is explicit and composable
- Validation and authorization are strictly separated
- Adapters isolate third-party ACL engines
- Helpers enforce consistency and DX
- Errors are precise, structured, and predictable

This model scales from small services to complex multi-tenant SaaS architectures.
