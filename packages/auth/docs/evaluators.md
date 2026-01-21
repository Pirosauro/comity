# Writing Evaluators for @comity/auth

This document explains how to design and implement **Assurance Evaluators**
for the `@comity/auth` module.

Evaluators are responsible for **computing assurance**, not enforcing rules.

---

## What Is an Evaluator?

An evaluator:

- computes an `AuthSessionAssurance`
- based on input facts and context
- without enforcing minimum requirements

It answers the question:

> “How strong is this authentication?”

---

## Evaluator vs Policy

| Responsibility       | Evaluator | Policy |
| -------------------- | --------- | ------ |
| Compute score        | ✅        | ❌     |
| Decide minimum       | ❌        | ✅     |
| Throw errors         | ❌        | ✅     |
| Be composable        | ✅        | ⚠️     |
| Runtime configurable | ✅        | ✅     |

**Evaluators produce facts. Policies enforce rules.**

---

## Evaluator Interface

```ts
export interface AuthSessionAssuranceEvaluator<I = unknown> {
  evaluate(input: I, now: number): AuthSessionAssurance;
}
```

### Notes

- The input is **generic**
- This allows reuse for:
  - CreateSession
  - StepUpSession
  - custom flows

---

## AuthSessionAssurance Structure

```ts
export interface AuthSessionAssurance<C = unknown> {
  /** Calculated assurance score */
  score: number;

  /** Timestamp of evaluation */
  evaluatedAt: number;

  /** Version for future migrations */
  version: number;

  /** Authentication methods used */
  methods: readonly string[];

  /** Optional proof (opaque) */
  proof?: string;

  /** Optional contextual data */
  context?: C;
}
```

---

## Evaluator Design Principles

### 1. Evaluators Must Be Deterministic

Given the same input + time → same output.

❌ No randomness  
❌ No I/O  
❌ No repository access

---

### 2. Evaluators Must Never Throw

Evaluators **do not reject**.

If something is missing or weak:

- compute a lower score
- include context explaining why

Rejection happens later via policies.

---

### 3. Evaluators Are Additive

A good evaluator:

- starts from a baseline
- adds or subtracts score components
- keeps logic transparent

---

## Example: Composable Evaluator

```ts
export class DefaultAssuranceEvaluator implements AuthSessionAssuranceEvaluator<CreateSessionInput> {
  evaluate(input: CreateSessionInput, now: number): AuthSessionAssurance {
    let score = 0;

    // Authentication methods
    score += input.methods.length * 10;

    // Context-based bonuses
    if (input.context?.identityId) score += 20;
    if (input.context?.deviceId) score += 10;
    if (input.context?.ipAddress) score += 5;
    if (input.context?.channel === "web") score += 5;

    return {
      score,
      evaluatedAt: now,
      version: input.version,
      methods: input.methods,
      ...(input.proof ? { proof: input.proof } : {}),
      ...(input.context ? { context: input.context } : {}),
    };
  }
}
```

---

## Chaining Evaluators

Evaluators can be chained or composed:

```ts
export class ChainEvaluator<I> implements AuthSessionAssuranceEvaluator<I> {
  constructor(private readonly evaluators: AuthSessionAssuranceEvaluator<I>[]) {}

  evaluate(input: I, now: number): AuthSessionAssurance {
    return this.evaluators.reduce(
      (acc, evaluator) => {
        const next = evaluator.evaluate(input, now);
        return {
          ...next,
          score: acc.score + next.score,
        };
      },
      {
        score: 0,
        evaluatedAt: now,
        version: 1,
        methods: [],
      }
    );
  }
}
```

---

## What Evaluators Should NOT Do

❌ Enforce minimum scores  
❌ Check session expiration  
❌ Know about refresh or revocation  
❌ Emit events

---

## When to Write a New Evaluator

Write a new evaluator when:

- authentication sources change
- you add new identity signals
- assurance scoring logic evolves

Do **not** change policies for scoring changes.

---

## Mental Model

> **Evaluators explain “how strong”.  
> Policies decide “strong enough”.**

---
