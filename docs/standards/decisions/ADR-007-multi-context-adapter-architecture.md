# ADR-007 — Multi-Context Adapter Architecture for Platform Integrations

**Status:** Accepted

## Context

A storefront platform integration implements a single external system (a platform's GraphQL storefront API) but satisfies contracts from multiple Core Modules:

- `@comity/storefront` (route resolution, context resolver)
- `@comity/catalog` (`CategoryRepository`, `ProductRepository`)
- `@comity/router` (URL rewriters)
- `@comity/cache` (cached repository decorators)
- `@comity/graphql-client` (client contract, transport)

It also depends on `@comity/graphql-builder`, `@comity/http`, `@comity/media`, `@comity/search`, `@comity/seo`, and `@comity/primitives`.

The current layering rule (`layering-policy.md §2.3`, `public-api.md §1`) states that an Adapter "MAY depend on one Core Module". A storefront platform integration violates this rule in letter: it is a single package that depends on many Core Modules and implements several contracts at once.

The architectural question is whether this violation is a defect to be fixed by splitting, or the symptom of a missing adapter category.

### Why a platform integration is structurally different from a technology adapter

A **Technology Adapter** (`@comity/http-hono`, `@comity/sql-kysely`) binds one Core Module to one interchangeable technology. The Core Module defines the contract; the adapter supplies the implementation; either side is replaceable independently. The one-core-module rule exists to keep that replacement granular.

A **platform integration** is different:

- It is a single external system with a single API surface (the GraphQL storefront schema).
- Its repositories (`category`, `product`, `route`) share one GraphQL client, one schema definition layer (`src/internal/schema`), one mapper layer (`src/internal/mappers`), one normalization layer (`src/internal/normalize.ts`), and one error surface.
- The platform's data model crosses Core Module boundaries: a product page composes catalog, media, and content; route resolution feeds both router and catalog.
- The platform is not interchangeable piece-by-piece. A catalog implementation is only meaningful inside the integration; it shares queries, schema fragments, and mappers with the content and route implementations.

Splitting the integration across packages would either duplicate the shared platform-specific layers or force them into an internal shared package — recreating the integration as an artificial dependency cluster.

## Options Evaluated

### Option A — Split into per-module adapters

Proposed packages:

- `@comity/storefront-<platform>` (the existing integration)
- `@comity/catalog-<platform>`
- `@comity/content-<platform>`
- `@comity/router-<platform>`

Each package satisfies one Core Module contract, restoring the "one adapter = one core module" rule literally.

**Advantages:**

- Stays within the existing adapter definition; no new category.
- Each package has a single public contract and a narrow test surface.

**Disadvantages:**

- The platform's GraphQL schema, query builders, mappers, filters, and normalization layer are shared across the split packages. They must be either duplicated (behavior drift, divergence) or extracted into an internal shared package (a hidden "platform core" that re-introduces coupling).
- One GraphQL client and one configuration surface (endpoint, headers, transport) must be shared or duplicated across packages; module setup and service registration split across multiple `module` definitions.
- Repository-to-repository coupling (e.g., route resolution feeding category/product lookups) becomes cross-package dependency.
- The split does not reflect the external system's boundaries. The platform is one system; the packages would be its arbitrary fragments.

### Option B — Introduce the Integration Adapter category

Introduce a new, distinct adapter category: **Integration Adapter**.

An Integration Adapter binds **one external platform/system** to **one or more Core Module contracts**, sharing a single technology binding and a single configuration surface. It is distinct from a Technology Adapter, which binds one Core Module to one interchangeable technology.

**Advantages:**

- Matches the external system's real boundary (one platform, one GraphQL API).
- Keeps the shared platform schema/mapper/normalization layer in one package, preventing duplication.
- Preserves the single configuration, single client, single setup, single lifecycle that a platform integration actually has.
- Keeps replaceability at the granularity that matters: the whole platform integration is replaceable, not individual repositories.
- Future platform integrations (Shopify, commercetools, Hygraph) follow the same shape.

**Disadvantages:**

- Requires amending the adapter definition to recognize a second adapter kind.
- The one-core-module rule no longer applies to Integration Adapters; reviewers must verify the integration is genuinely a single external platform and not a grab-bag of unrelated adapters.

## Decision

Adopt **Option B**. Introduce the **Integration Adapter** as a distinct adapter category.

The existing "one adapter = one core module" rule continues to apply to **Technology Adapters**. Integration Adapters are governed by the rules below.

### Definition

| Category                | Binds                                                             | Rule                                                                      | Examples                                                                                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Technology Adapter**  | One Core Module to one interchangeable technology                 | One Core Module per adapter                                               | `@comity/http-hono`, `@comity/sql-kysely`, `@comity/graphql-client-ws`, `@comity/router-path-to-regexp` |
| **Integration Adapter** | One external platform/system to one or more Core Module contracts | One external platform per adapter; multiple Core Module contracts allowed | —                                                                                                       |

A package qualifies as an Integration Adapter only when all of the following hold:

1. It binds to a single named external system/platform with a single primary API surface.
2. The contracts it implements genuinely share platform-specific schema, mapping, and normalization that would otherwise be duplicated or forced into a shared package.
3. Its configuration surface is unified (one client, one endpoint, one setup module).
4. It is replaceable as a whole against another platform, not piece-by-piece.

If a package does not satisfy all four criteria, it MUST be modeled as one or more Technology Adapters.

### Dependency Rules

An Integration Adapter:

- MAY depend on the Core Modules whose contracts it implements.
- MAY depend on the Adapters that provide the underlying technology (e.g., a GraphQL transport adapter such as `@comity/graphql-client-ws`), keeping those dependencies replaceable.
- MAY depend on `@comity/primitives` and `@comity/kernel`.
- MUST NOT depend on other Integration Adapters.
- MUST NOT depend on Application-layer code.
- MUST NOT import other Core Modules beyond those whose contracts it implements and the shared helpers needed to implement them.
- MUST keep each Core Module contract implemented in a bounded area of the package (e.g., `src/repositories/*` maps one Core Module's repository contract to the platform), so the dependency surface stays explicit.

A Technology Adapter continues to depend on exactly one Core Module.

### Public API Rules

- The Integration Adapter root barrel exports the concrete implementations of the Core Module contracts it satisfies (matching `public-api.md §2.2`), e.g., `<Platform>CategoryRepository`, `<Platform>ProductRepository`.
- The Integration Adapter root barrel MUST NOT re-export Core Module contracts (consumers import contracts from the Core Module).
- Shared platform internals (schema, mappers, normalization, filters) MUST stay under `src/internal/` and MUST NOT be public.
- The setup contract (`src/setup/types.ts`) is the single public configuration surface for the integration.
- One setup module defines the integration's service registration and lifecycle hooks.

### Ownership

- The Core Modules retain ownership of their contracts. They do not know about the integration.
- The Integration Adapter owns the mapping from platform data to Core Module domain models, and the platform-specific schema/query/mapper layers.
- The Integration Adapter owns the platform's error normalization into the Core Module error surfaces.
- The Application layer owns whether and how to compose the integration's repositories and services; the integration exposes services via its setup module.

### Lifecycle

- The Integration Adapter is initialized through the standard module setup lifecycle (`composition/setup` `module` metadata).
- Its `module` declares the Core Modules it depends on (`dependsOn`) so the kernel wires them in order.
- Its setup registers the repositories and services it owns, and defines the integration's configuration hooks (`*:configuring`, `*:initialized`).
- Replacing the platform means replacing the Integration Adapter package and its setup, without touching Core Modules or Application orchestration.

## Consequences

**Positive:**

- The one-core-module rule stays intact for Technology Adapters where it provides real value (fine-grained replacement).
- Platform integrations follow a single documented shape, preventing both duplication (Option A's internal-shared-package trap) and rule violations-by-exception.
- Future platform integrations (Shopify, commercetools, Hygraph) have a clear template.
- Platform integrations are legitimized without restructuring.

**Negative / Trade-offs:**

- The adapter model now has two categories; reviewers must distinguish them.
- Integration Adapters carry more dependencies by nature; the qualifying criteria are the guardrail against abuse.
- `public-api.md`, `layering-policy.md`, and `adapters.md` must be amended to document the Integration Adapter category (separate change following this ADR's approval).

## Scope

This ADR concerns:

- the definition of the Integration Adapter category;
- the rules governing Integration Adapter dependencies, public API, ownership, and lifecycle;
- the classification of a platform integration.

This ADR does NOT concern:

- changes to a specific integration's implementation;
- the internal content of any future integration;
- Technology Adapter rules (unchanged);
- the one-adapter-per-technology principle for Technology Adapters.

## References

- `docs/standards/layering-policy.md` §2.3 — Adapters "MAY depend on one Core Module".
- `docs/standards/adapters.md` — Adapter responsibilities and boundaries.
- `docs/standards/public-api.md` §1, §2.2 — Package classification and adapter root barrel rules.
