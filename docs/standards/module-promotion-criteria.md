# Comity Coding Standards — Module Promotion Criteria

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/module-promotion-criteria.md`
This document defines when an Extension should be promoted to a Core Module.

Promotion is rare.

Stability is required.

---

# 1. Promotion Requirements

An Extension may be promoted only if:

1. It is used across multiple production systems
2. Its abstraction is stable
3. It does not depend on a specific framework
4. It defines a reusable contract
5. It does not introduce policy into Kernel

---

# 2. What Cannot Be Promoted

The following must remain Extensions:

- Rate limiting policies
- Circuit breaker strategies
- Vendor-specific tracing
- Observability implementations

These are operational concerns.

---

# 3. Promotion Process

Before promotion:

- API must be versioned
- Error model must comply with standards
- Dependency graph must remain acyclic
- Documentation must be complete

Promotion requires architectural review.

---

# 4. Core Qualification Checklist

A module qualifies as Core only if:

- It defines contracts, not policy
- It remains infrastructure-agnostic
- It increases replaceability
- It reduces duplication across projects

---

# Final Principle

Core modules define abstraction.

Extensions define policy.

Promotion happens when abstraction becomes universal.
