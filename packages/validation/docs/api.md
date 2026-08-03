# @comity/validation — API Reference

## Public Exports

```text
@comity/validation
├── Validator<T>
└── ValidationResult<T>

@comity/validation/errors
├── ValidationError
├── ValidationErrorDetails
├── ValidationErrorMeta
├── ValidationErrorReason
└── ValidationIssue
```

`ValidationErrorCode` is not exported by the current source. The code value lives on `ValidationError.code` as an inline template-literal type.

---

## Validator<T>

Validation contract implemented by adapters.

```ts
interface Validator<T = unknown> {
  validate(input: T): ValidationResult<T> | Promise<ValidationResult<T>>;
}
```

### Purpose

Defines the boundary between a caller and a validation implementation.

### Example

```ts
import type { Validator } from "@comity/validation";

const nonEmptyString: Validator<string> = {
  async validate(value) {
    return value.length > 0
      ? { success: true, value }
      : { success: false, error: new Error("invalid") as never };
  },
};
```

The example above shows the shape of the contract only. Real failures should use `ValidationError`.

---

## ValidationResult<T>

```ts
type ValidationResult<T> = Result<T, ValidationError>;
```

### Purpose

Typed success-or-failure result returned by `Validator<T>`.

### Example

```ts
import type { ValidationResult } from "@comity/validation";

declare const result: ValidationResult<string>;

if (result.success) {
  console.log(result.value);
} else {
  console.log(result.error.code);
}
```

---

## ValidationError

```ts
class ValidationError extends BaseError<ValidationErrorMeta> {
  readonly code: `validation:${ValidationErrorReason}`;
  constructor(reason: ValidationErrorReason, meta?: Omit<ValidationErrorMeta, "reason">);
}
```

### Purpose

Represents a structured validation failure.

### Example

```ts
import { ValidationError } from "@comity/validation/errors";

const error = new ValidationError("failed", {
  details: {
    fields: {
      email: [{ code: "invalid_format" }],
    },
  },
});

console.log(error.code); // validation:failed
console.log(error.meta.reason); // failed
console.log(error.meta.details?.fields?.email?.[0]?.code); // invalid_format
```

---

## ValidationErrorDetails

```ts
interface ValidationErrorDetails {
  fields?: Readonly<Record<string, ReadonlyArray<ValidationIssue>>>;
}
```

### Purpose

Carries structured field-level validation issues.

### Example

```ts
import type { ValidationErrorDetails } from "@comity/validation/errors";

const details: ValidationErrorDetails = {
  fields: {
    password: [{ code: "required" }, { code: "too_short" }],
  },
};
```

---

## ValidationErrorMeta

```ts
interface ValidationErrorMeta extends ErrorMeta {
  readonly reason: ValidationErrorReason;
  readonly details?: Readonly<ValidationErrorDetails>;
}
```

### Purpose

Extends primitive error metadata with validation-specific reason and details.

### Example

```ts
import type { ValidationErrorMeta } from "@comity/validation/errors";

const meta: ValidationErrorMeta = {
  reason: "failed",
  details: {
    fields: {
      email: [{ code: "invalid_format" }],
    },
  },
};
```

---

## ValidationErrorReason

```ts
type ValidationErrorReason = "failed";
```

### Purpose

Enumerates the current validation failure reasons.

### Example

```ts
import type { ValidationErrorReason } from "@comity/validation/errors";

const reason: ValidationErrorReason = "failed";
```

---

## ValidationIssue

```ts
interface ValidationIssue {
  code: string;
}
```

### Purpose

Represents a single adapter-defined validation issue for a field.

### Example

```ts
import type { ValidationIssue } from "@comity/validation/errors";

const issue: ValidationIssue = {
  code: "required",
};
```

---

## Dependencies

```text
@comity/validation → @comity/primitives
```
