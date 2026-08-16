# README Standards — Comity Framework

Document that defines the structure, tone, and conventions for all `README.md` files across Comity packages.

---

## Mandatory Structure

Every README must contain the following sections, in this exact order:

```
# @comity/[name]

[one-sentence description, max 10 words]

---

## Purpose

[2-3 sentences describing what the package owns, without prescribing usage]

---

## Scope

This package:

- ✅ [verb] [what it does]
- ✅ [verb] [what it does]

This package does NOT:

- ❌ [verb] [what it does not do]
- ❌ [verb] [what it does not do]

---

## Public API

- [domain]: [conceptual description, not enumerative]
- [domain]: [conceptual description, not enumerative]

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/[name] — [brief relationship description, max 5 words]

---

## Status

Stable | Experimental | Draft

_Review Completed: YYYY-MM-DD_
_Reviewer: ..._
_Compliance Score: N% (Green)_
```

## Forbidden Sections

- "Getting Started" or "Installation" sections
- "Usage" or "Examples" sections
- "API Reference" (use Documentation links instead)
- "Contributing" sections
- "License" sections
- Emoji section headers or icons outside Scope ✅/❌

## Tone of Voice Principles

1. **Authoritative, not prescriptive** — Explains what the package provides, does not prescribe how to use it
2. **3rd person and impersonal** — Never "you", "we", "our"
3. **Concise** — Every word counts
4. **Technical, not academic** — Domain terminology without unnecessary jargon
5. **Coherent** — Same style across all packages

### Prohibited

| Incorrect                                                                              | Correct                       |
| -------------------------------------------------------------------------------------- | ----------------------------- |
| "You can use this package to..."                                                       | "Provides..."                 |
| "We expose lifecycle events..."                                                        | "Exposes lifecycle events..." |
| "Our approach to routing..."                                                           | ---                           |
| "This package provides HTTP contracts..." (the initial line form; this can be avoided) | "Provides HTTP contracts..."  |

### Verbs Usage Matrix

| Priority | Verb     | Use For                         | Example                                     |
| -------- | -------- | ------------------------------- | ------------------------------------------- |
| P0       | defines  | Contracts, types, documentation | "Defines cache and store contracts"         |
| P0       | provides | Implementations, functionality  | "Provides in-memory store implementation"   |
| P0       | exposes  | Public API surface              | "Exposes lifecycle events"                  |
| P1       | offers   | Optional/opt-in features        | "Offers TTL and cache key management"       |
| P1       | encodes  | Domain concepts                 | "Encodes concepts, not implementations"     |
| P1       | manages  | State/lifecycle                 | "Manages request-scoped context"            |
| P1       | executes | Actions/behaviors               | "Executes HTTP requests through middleware" |

Avoid: handles, does, has, includes, supports, is, works, allows.

### Scope Section Rules

- Each bullet starts with a verb
- No verb repeats more than twice in the same section
- Avoid "it" or "this package" at the start of bullets
- Pattern: `- ✅ defines cache and store contracts`
- Positive bullets cover responsibilities; negative bullets cover explicit exclusions

### Public API Section Rules

- Group by domain, not by files or subpaths
- Use plural nouns for collections: `contracts`, `stores`, `hooks`
- Do not list files or enumerations
- Final line `No exhaustive reference; see docs for constraints.` is **MANDATORY**

### Related Packages Section Rules

- Use em dash (—) between package and description
- Description max 5 words
- Describe the relationship type (e.g., "Kernel adapter", "Auth token integration")
- Only list packages directly related

### Status Section Rules

- Must contain: `## Status`, a stable/experimental/draft label, review metadata
- Date in ISO format: `YYYY-MM-DD`
- Compliance: `Compliance: N% (Green)`
- Vocabulary: `Draft` (design incomplete or not ready for general usage), `Experimental` (usable, APIs may change without compatibility guarantees), `Stable` (public API compatibility guaranteed)
- Do not infer maturity from package version numbers

## Review Checklist

For each README, verify:

- □ No "you", "we", "our" in text
- □ Every sentence starts with subject + verb
- □ Verbs match the matrix (`defines` for contracts, `provides` for impl, etc.)
- □ One-line description within 10 words
- □ `## Scope` uses `✅` and `❌` with leading verbs
- □ `## Public API` describes domains, not files
- □ `## Related Packages` uses em dash
- □ `## Status` includes review metadata
- □ Tone is formal but accessible (no internal jargon)
- □ Sections match exactly the eight mandatory ones, in order
