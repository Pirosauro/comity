import type {
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "./contracts/session-assurance-evaluator.js";
import type {
  AuthSessionAssurance,
  AuthSessionAssuranceContext,
} from "./contracts/session-assurance.js";

/**
 * Evaluates assurance by aggregating results from multiple evaluators.
 *
 * Combines scores, merges methods uniquely, and consolidates context from all evaluators.
 *
 * @typeParam C - Context type for assurance evaluation
 */
export class CompositeAssuranceEvaluator<
  C = AuthSessionAssuranceContext,
> implements AuthSessionAssuranceEvaluator<C> {
  #evaluators: readonly AuthSessionAssuranceEvaluator<C>[];

  /**
   * @param evaluators - Collection of assurance evaluators to combine
   */
  constructor(evaluators: readonly AuthSessionAssuranceEvaluator<C>[]) {
    this.#evaluators = evaluators;
  }

  /** @inheritdoc */
  evaluate(input: AuthSessionAssuranceInput<C>, now: number): AuthSessionAssurance {
    let score = 0;
    const methods = new Set<string>();
    const context = new Map<string, unknown>();

    for (const evaluator of this.#evaluators) {
      const partial = evaluator.evaluate(input, now);

      // Aggregate score
      score += partial.score;

      // Merge methods
      for (const method of partial.methods) {
        methods.add(method);
      }

      // Merge context
      if (partial.context) {
        Object.entries(partial.context).forEach(([key, value]) => {
          if (!context.has(key)) {
            context.set(key, value);
          }
        });
      }
    }

    return {
      score,
      evaluatedAt: now,
      version: input.version,
      methods: Array.from(methods),
      ...(context.size > 0 ? { context: Object.fromEntries(context.entries()) } : {}),
    };
  }
}
