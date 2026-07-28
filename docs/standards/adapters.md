# Comity Coding Standards — Adapters

This document defines what **adapters** are in Comity, what they are responsible for,
and how they must interact with the kernel and modules.

Adapters are intentionally **not** modules.

---

## 1. What Is an Adapter?

An adapter is a **bridge** between Comity and the outside world.

Examples:

- HTTP servers (Hono, Fastify, Fetch, Bun, Node)
- Runtimes
- Platform integrations

Adapters translate **external stimuli** into Comity primitives and back.

---

## 2. Core Principle

> Adapters adapt. They do not decide.

Adapters MUST:

- Be thin
- Be replaceable
- Be framework-specific

Adapters MUST NOT:

- Contain business logic
- Contain domain logic
- Contain module logic

---

## 3. Adapters vs Modules

| Concern            | Modules    | Adapters             |
| ------------------ | ---------- | -------------------- |
| Reusability        | High       | Low / platform-bound |
| Domain knowledge   | Yes        | No                   |
| Framework-specific | No         | Yes                  |
| Lifecycle control  | Hook-based | External             |
| Kernel dependency  | Yes        | Yes                  |

Adapters are consumers of modules, not participants.

---

## 4. Adapter Responsibilities

An adapter MAY:

- Instantiate the kernel
- Configure the kernel
- Register modules
- Translate incoming requests
- Translate outgoing results

An adapter MUST:

- Respect kernel lifecycle
- Respect module contracts
- Handle I/O and side effects

---

## 5. Adapter Boundaries

Adapters MUST NOT:

- Register kernel hooks
- Emit domain events
- Mutate module state
- Depend on internal module APIs

Adapters interact only through:

- Public facades
- Kernel APIs
- Explicit entrypoints

---

## 6. HTTP Adapters (Example)

An HTTP adapter:

- Receives a framework request
- Creates an `HttpContext`
- Invokes the HTTP facade
- Translates `HttpResult` into a framework response

Example flow:

```
Framework Request
  ↓
HttpAdapter
  ↓
HttpFacade.handle(ctx)
  ↓
HttpResult
  ↓
Framework Response
```

---

## 7. Error Handling

Adapters MUST:

- Catch errors thrown by facades
- Translate them to framework-specific responses
- Never swallow errors silently

Adapters MUST NOT:

- Invent new domain errors
- Modify error semantics
- Leak internal error details

---

## 8. Events & Observability

Adapters MAY:

- Listen to kernel events
- Listen to module events
- Emit transport-level events

Adapters MUST:

- Treat events as optional
- Avoid coupling logic to event delivery

Adapters MUST NOT:

- Rely on events for correctness

---

## 9. Adapter Packaging

Adapters SHOULD:

- Live in separate packages
- Be named explicitly

Examples:

- `@comity/http-hono`
- `@comity/graphql-client-ws`
- `@comity/router-path-to-regexp`

Adapters MUST NOT:

- Be bundled into core modules
- Be required dependencies of modules

---

## 10. Stability & Compatibility

Adapters:

- Are allowed to evolve faster than modules
- May introduce breaking changes more frequently
- MUST track compatibility with module versions

---

## Summary

Adapters are **edges**, not **centers**.

If a piece of code:

- Knows about frameworks → adapter
- Knows about domains → module
- Knows about execution → kernel

Keeping adapters thin is what keeps Comity portable.
