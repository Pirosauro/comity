# @comity/validation — Design Document

## Module Responsibility

`@comity/validation` owns the validation contract and structured error model used across Comity core modules. It defines the boundary that validation adapters must implement, but it does not define validation rules or schema semantics.

The module answers two questions only:

- what shape a validator must expose
- what shape a validation failure must take

---

## Layer Classification

`@comity/validation` is a Core Module.

Dependency direction:

```text
Adapters
      ↓
@comity/validation
      ↓
@comity/primitives
```

The module depends only on `@comity/primitives`. It must not depend on adapters, schema libraries, HTTP frameworks, or application-layer code.

---

## Public Concepts

### Validator<T>

The central contract.

```ts
interface Validator<T = unknown> {
  validate(input: T): ValidationResult<T> | Promise<ValidationResult<T>>;
}
```

Design properties:

- The validator is generic over the value type it validates.
- The contract is async-capable; implementations may return either a direct result or a promise.
- The validator returns a `Result`-shaped success or failure value rather than throwing for routine validation outcomes.

### ValidationResult<T>

Type alias for `Result<T, ValidationError>`.

```ts
type ValidationResult<T> = Result<T, ValidationError>;
```

### ValidationErrorReason

Current reason union:

```ts
type ValidationErrorReason = "failed";
```

### ValidationErrorMeta

Error metadata contract carried by `ValidationError`.

```ts
interface ValidationErrorMeta extends ErrorMeta {
  readonly reason: ValidationErrorReason;
  readonly details?: Readonly<ValidationErrorDetails>;
}
```

### ValidationErrorDetails

Structured field-level failure payload.

```ts
interface ValidationErrorDetails {
  fields?: Readonly<Record<string, ReadonlyArray<ValidationIssue>>>;
}
```

### ValidationIssue

Single field issue record.

```ts
interface ValidationIssue {
  code: string;
}
```

---

## Error Model

### ValidationError

`ValidationError` extends `BaseError<ValidationErrorMeta>`.

```ts
class ValidationError extends BaseError<ValidationErrorMeta> {
  readonly code: `validation:${ValidationErrorReason}`;
  constructor(reason: ValidationErrorReason, meta?: Omit<ValidationErrorMeta, "reason">);
}
```

Current implementation details:

- The only implemented reason is `"failed"`.
- The runtime code value is `"validation:failed"`.
- `details` carries structured field information and is optional.

The error model is intentionally small. The package does not define a separate validation report type, validation pipeline, or aggregation layer.

---

## Validation Flow

```text
Consumer
    │
    ├─ calls validator.validate(value)
    │
    ▼
Validator implementation
    │
    ├─ success → Result.success(value)
    │
    └─ failure → Result.failure(new ValidationError("failed", { details }))
    │
    ▼
Consumer branches on Result.success
```

The contract does not prescribe how validation is implemented internally. It only standardizes the input, output, and error shape.

---

## Dependency Rules

Allowed dependencies:

- `@comity/primitives`

Forbidden dependencies:

- adapter packages
- schema libraries
- application-layer modules
- UI frameworks
- HTTP frameworks

---

## What the Module Does Not Own

- Validation rules
- Schema definitions or DSLs
- Zod/Yup/JSON Schema integration
- HTTP request validation
- Form validation
- UI error presentation
- Validation pipelines
- Validation aggregators
- Retry or queue behavior

---

## Source Mismatch

`ValidationErrorCode` is not exported by the current source.

The current source models the code as an inline property on `ValidationError`:

```ts
readonly code: `validation:${ValidationErrorReason}`;
```

The only current runtime value is `validation:failed`.
