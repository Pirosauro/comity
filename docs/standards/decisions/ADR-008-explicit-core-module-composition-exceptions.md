# ADR-008 — Explicit Core Module Composition Exceptions

**Status:** Accepted

## Context

Comity Core Modules intentionally provide reusable capabilities.

The current dependency rule states:

> Core Modules MUST NOT depend on other Core Modules unless explicitly allowed.

During repository review, several Core-to-Core dependencies were identified in the codebase:

| Dependency              | Import kind                |
| ----------------------- | -------------------------- |
| `storefront → catalog`  | Value (DI tokens) + type   |
| `storefront → content`  | Type-only                  |
| `storefront → search`   | Type-only                  |
| `storefront → http`     | Type-only                  |
| `catalog → media`       | Type-only                  |
| `catalog → search`      | Type-only                  |
| `content → media`       | Type-only                  |
| `content → search`      | Type-only                  |
| `content → seo`         | Type-only                  |
| `address → validation`  | Type-only                  |
| `customer → validation` | Type-only                  |
| `identity → validation` | Type-only                  |
| `auth-tokens → auth`    | Value (`AuthError`) + type |
| `html → http`           | Type-only                  |
| `router → http`         | Type-only                  |

Revision 1 of this ADR framed these as legitimate "capability composition" and proposed a Capability Composition Test that could be read as **general permission** for Core Modules to depend on each other.

That framing is rejected. It weakens the layering model: "if a dependency satisfies a test, it may be added" inverts the architectural default, which is isolation.

This ADR reframes the intent:

> Core-to-Core dependencies remain forbidden by default. This ADR does NOT authorize Core Modules to depend on each other. It defines the exhaustive, closed list of approved exceptions.

Every dependency below is an **exception**, not a right. Removing any of them remains preferable to keeping them; the ADR's register only fixes the current state so the architecture is honest about what already exists.

## Decision

1. Core Modules remain a single architectural category. No second category ("Strategic Core", "Composable Core", etc.) is introduced.
2. The default dependency rule is unchanged: **Core Modules MUST NOT depend on other Core Modules unless explicitly allowed.**
3. This ADR is the exhaustive exception register. A Core-to-Core dependency not listed here is a violation and MUST be removed or justified by a new ADR.
4. The register classifies each current dependency as one of:

- Capability Exception
- Infrastructure Contract Exception
- Value-Import Exception
- Candidate for Removal

5. New Core-to-Core dependencies require an ADR before introduction. This ADR grants no standing permission.

### Title justification

Revision 1's title, "Explicit Core Module Composition Boundaries", implies the ADR draws a boundary around what composition is allowed. The intent is narrower: composition stays forbidden, and this document only lists approved exceptions.

The title is renamed to **"Explicit Core Module Composition Exceptions"** to match that intent. "Exceptions" makes the default (forbidden) visible in the title itself and prevents the ADR from being cited as general permission.

## Exception Acceptance Criteria

A dependency in the register is acceptable only if ALL of the following hold. These criteria are used to evaluate the register; they do not grant new dependencies.

1. **Capability ownership** — The consumed capability is owned by the depended module.
2. **Ownership direction** — The dependency direction follows ownership (a higher-level capability may reference a lower-level one; never the reverse).
3. **Required contract dependency** — The requirement is evaluated through architectural review, not by the dependency proposer. A dependency being useful or convenient is not sufficient. All new Core-to-Core dependencies require explicit ADR approval.
4. **No implementation coupling** — The dependency must not reach into the depended module's implementation internals.
5. **No cycles** — The depended module must not (transitively) depend on the consumer.
6. **Documented** — The dependency is recorded in this ADR.
7. **Type-only preferred** — Value imports require explicit justification and are listed as value-import exceptions.
8. **Contract surface isolation** — A Core Module MUST NOT expose another Core Module's specialized domain concepts in its own public contracts unless the dependency represents domain ownership. This avoids cases such as catalog contracts exposing search-specific models.

## Dependency Categories

### Capability Exceptions

Type-only references where a higher-level domain capability references a lower-level domain capability's contracts. Direction follows ownership; the reference is to the depended module's public contracts.

These are the closest to "legitimate composition," but they remain exceptions, not a right.

### Infrastructure Contract Exceptions

Type-only references to infrastructure contract types that currently live inside Core Modules (`@comity/http`). These exist because some infrastructure contracts (request, response, status codes, context) are hosted by Core Modules today.

These exceptions are **compatibility exceptions only**:

- they are not a preferred dependency pattern;
- they should not be replicated;
- extracting these contracts into a lower layer (e.g., `@comity/primitives` or a dedicated transport-contract package) may be considered in future ADRs.

For rendering modules (`@comity/html`), the exception is scoped strictly to contract types:

- the module does NOT depend on HTTP runtime;
- the module does NOT execute HTTP logic;
- the dependency is limited to HTTP contract types (`HttpResponse`, `HttpStatus`);
- the dependency is registered in this ADR as an Infrastructure Contract Exception.

### Candidates for Removal

Dependencies that fail one or more acceptance criteria and SHOULD be removed or refactored. They are kept in the register only because they currently exist and removal is a migration, not a decision.

## Dependency Register (closed list)

### Capability Exceptions

| Dependency              | Import kind | Justification                                                       |
| ----------------------- | ----------- | ------------------------------------------------------------------- |
| `storefront → catalog`  | Type-only   | Storefront references catalog domain contracts and models.          |
| `storefront → content`  | Type-only   | Storefront content page composer references content domain models.  |
| `storefront → search`   | Type-only   | Storefront search page contract references `SearchResultModel`.     |
| `storefront → taxonomy` | Type-only   | Storefront category composer references taxonomy domain contracts and models. |
| `catalog → media`       | Type-only   | Catalog entities reference `MediaModel` for product/brand media.               |
| `content → media`       | Type-only   | Content blocks/pages reference `MediaModel`.                        |
| `content → seo`         | Type-only   | Content pages reference `SeoModel`.                                 |
| `taxonomy → media`      | Type-only   | Taxonomy models reference `MediaModel` for category image.          |
| `order → pricing`       | Type-only   | Order items reference `Price` / `PriceModifier` / `Money`.            |
| `address → validation`  | Type-only   | Address validator consumes the shared `Validator` contract.         |
| `customer → validation` | Type-only   | Customer validator consumes the shared `Validator` contract.        |
| `identity → validation` | Type-only   | Identity validator consumes the shared `Validator` contract.        |

### Infrastructure Contract Exceptions

| Dependency          | Import kind | Justification                                                                                                                                                                                                                          |
| ------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `html → http`       | Type-only   | HTML render result / renderer reference `HttpResponse` / `HttpStatus`. Contract types only — no HTTP runtime dependency, no HTTP execution logic. Compatibility exception; extraction candidate.                                       |
| `router → http`     | Type-only   | Router contracts reference `HttpContext`, `HttpHandler`, `HttpMethod`. Compatibility exception; extraction candidate.                                                                                                                  |
| `storefront → http` | Type-only   | Storefront context contracts currently reference `HttpRequest` as part of their public contract surface. The dependency is required for the current contract shape and is therefore tolerated as a registered compatibility exception. |

> A transport-neutral `StorefrontContext` redesign may remove the `storefront → http` dependency in a future migration, but the current dependency is not considered a violation.

### Value-Import Exceptions

| Dependency             | Import kind                                                     | Justification                                                                                                                           |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `auth-tokens → auth`   | Value (`AuthError`) + type                                      | Token facade error surface normalizes `AuthError` at runtime.                                                                           |
| `storefront → catalog` | Value (`PRODUCT_REPOSITORY_TOKEN`) | These are DI wiring constants only. They do not expose catalog implementation details and are required during module setup composition. |
| `storefront → taxonomy` | Value (`TAXONOMY_REPOSITORY_TOKEN`) | DI wiring constant only. Required during module setup composition; does not expose taxonomy implementation details.                     |

### Ownership notes

`@comity/auth` owns authentication error semantics. `@comity/auth-tokens` consumes those semantics because token handling is an authentication capability.

The dependency direction is intentional.

`@comity/auth` MUST NOT depend on `@comity/auth-tokens` to prevent cyclic ownership.

### Candidates for Removal

| Dependency         | Failing criteria                                                                                                                                                                                           | Required action                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog → search` | Public contract surface coupling — `ProductRepository` embeds `SearchCriteriaModel` / `SearchResultModel` in its contract; search is a separate capability, not owned by catalog. | Move search-shaped repository methods to a search-specific contract (e.g., `@comity/search` ports) rather than embedding search types in catalog contracts. |
| `taxonomy → search` | Public contract surface coupling — same embedding of search types in the taxonomy repository contract.                                                                    | Same action as above, for taxonomy repositories.                                                                                                              |
| `content → search` | Public contract surface coupling — same embedding of search types in content repository contracts.                                                                         | Same action as above, for content repositories.                                                                                                             |

> Moving search-shaped methods out of catalog/taxonomy/content repository contracts is a public API change and must follow the breaking-change process.

### Explicitly NOT registered

The following were evaluated and REJECTED as exceptions:

| Dependency                         | Reason for rejection                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `catalog → storefront`             | Reverse ownership.                                                                            |
| `catalog → html`, `catalog → http` | Presentation/infrastructure leakage; domain capability must not reference delivery contracts. |
| `catalog → <adapter>`              | Core Module must not depend on an Adapter.                                                    |

### Planned future edges

The following edges were previously considered when a `@comity/checkout`
Core Module was imagined. That package does not exist; checkout is an
Application Layer workflow, not a Core Module.

- `checkout → catalog` — was intended as mapping `ProductProjection` into the
  order's owned product snapshot; the order already stores its own
  `OrderProductSnapshot` independently of the catalog.
- `checkout → pricing` — was intended as computing prices via `@comity/pricing`;
  the order already consumes `Money`/`Price` type-only (registered in
  ADR-008). No new `checkout → pricing` edge is required.
- `checkout → order` — was intended as reading and mutating `Order` through
  entity methods and repository; order mutations are now driven by the
  Application Layer, not a checkout package.
- `checkout → customer` — was intended as reading customer contracts to compose
  buyer data; the Application Layer loads customer facts and maps them into
  `OrderCustomerSnapshot` at order creation time.

These edges are **not** registered and must not be re-introduced. The
dependency graph documents compile-time module edges, not temporal
orchestration sequence.

---
The only registered Core-to-Core dependency edge is:

| Dependency              | Import kind | Justification                                                                                                                          |
| ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `order → pricing`       | Type-only   | Order items reference `Price` / `PriceModifier` / `Money`. Registered in ADR-008.                                                       |

## Forbidden Patterns (unchanged)

- Reverse ownership (`catalog → storefront`).
- Presentation leakage (`catalog → html`).
- Infrastructure leakage (`catalog → sql-kysely`, `content → <search adapter>`).
- Cross-adapter dependencies.
- New Core-to-Core dependencies not registered in this ADR.

## Consequences

**Positive:**

- The architectural default (isolation) is preserved and restated.
- The closed register makes every existing dependency auditable.
- Type-only vs value imports are distinguished, with value imports requiring explicit justification.
- Infrastructure contract exceptions are framed as compatibility, not a pattern, and marked as extraction candidates.

**Negative / Trade-offs:**

- The register fixes the current state; it does not remove the dependencies.
- Two candidates for removal remain until a separate migration is executed.
- Future legitimate composition requires an ADR each time — process overhead by design.

## Migration

- **No action required** for the Capability Exceptions.
- Infrastructure Contract Exceptions remain registered in ADR-008 and are tracked as future extraction candidates. Any extraction work requires a dedicated ADR.
- **Remove or refactor** the Candidates for Removal:
  - `catalog → search`, `taxonomy → search`, `content → search`: relocate search-shaped repository methods to search-owned contracts.
- **Enforce the closed register.** Repository architecture validation MUST verify:
  - every Core Module dependency edge exists in ADR-008;
  - unregistered Core-to-Core dependencies fail validation;
  - Adapter dependency rules are validated separately through ADR-007.

## Scope

This ADR concerns:

- the definition of the exception model;
- the closed dependency register;
- the classification of each existing Core-to-Core dependency.

This ADR does NOT concern:

- Adapter rules (Technology and Integration Adapters are unchanged);
- Kernel / Primitives rules;
- Application-layer rules;
- the internal implementation of any Core Module.

## References

- `docs/standards/layering-policy.md` §2.2 — Core Modules MUST NOT depend on other Core Modules unless explicitly allowed.
- `docs/standards/dependency-graph-policy.md` — Layered dependency model and forbidden edges. The rendering/HTTP rule has been amended to allow registered type-only HTTP contract references (see Revision 2.1 coordinated change).
- `docs/standards/public-api.md` §1 — Package classification.
- Package manifests and `src/` import graph — dependency evidence (`packages/*/package.json`, `packages/*/src/**/*.ts`).
- ADR-007 — Integration Adapter category (unchanged; Integration Adapter dependencies are governed by ADR-007, not this ADR).
