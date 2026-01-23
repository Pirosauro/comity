# @comity/http – Overview

`@comity/http` provides the core HTTP execution model for Comity.

It is designed as a **pipeline-based infrastructure module**, independent
from any HTTP framework.

---

## High-level Architecture

The request lifecycle follows this flow:

```
Adapter
  ↓
HttpContext
  ↓
HttpPipeline
  ↓
Middleware Chain
  ↓
HttpResult
  ↓
Adapter Response
```

---

## Core Concepts

### HttpContext

Represents the execution state of a single HTTP request.
It contains:

- Immutable request data
- Mutable shared state
- Optional response
- Abort signal
- Event emitter

---

### HttpPipeline

The pipeline:

- Executes middleware sequentially
- Stops execution when a response is produced
- Converts thrown errors into `HttpResult`

---

### Middleware

Middleware are small, composable units that:

- Inspect or enrich the request
- Perform validation or side effects
- Optionally terminate the pipeline by setting a response

Middleware are NOT controllers.

---

### HttpResult

The pipeline produces a `HttpResult`, which represents:

- A successful response
- Or a failure with a structured error

Adapters are responsible for rendering the result.

---

## Design Goals

- Framework-agnostic
- Predictable execution
- Strong separation of concerns
- Event-driven observability
- Minimal public API surface
