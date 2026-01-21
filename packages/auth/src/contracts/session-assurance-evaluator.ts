import type { AuthSessionAssurance, AuthSessionAssuranceContext } from "./session-assurance.js";

/** Modifier that contributes to assurance scoring. */
export interface AssuranceScoreModifier<C = AuthSessionAssuranceContext> {
  /** Modifier name. */
  readonly name: string;

  /**
   * Compute the numeric modification for the given input.
   *
   * @param input - Assurance input
   * @param now - Current timestamp in milliseconds
   * @returns Numeric modifier to apply to the score
   */
  apply(input: AuthSessionAssuranceInput<C>, now: number): number;
}

/** Input used to evaluate session assurance. */
export interface AuthSessionAssuranceInput<C = AuthSessionAssuranceContext> {
  /** Authentication methods used (pwd, otp, webauthn, ...) */
  readonly methods: readonly string[];

  /** Optional external proof (assertion, jwt, attestation, ...) */
  readonly proof?: string;

  /** Optional evaluation context */
  readonly context?: C;

  /** Assurance version (incremented on step-up) */
  readonly version: number;
}

/** Evaluates an assurance snapshot from input data. */
export interface AuthSessionAssuranceEvaluator<C = AuthSessionAssuranceContext> {
  /**
   * Evaluate session assurance.
   *
   * @param input - The session creation input
   * @param now - Current timestamp in milliseconds
   * @returns The evaluated session assurance
   */
  evaluate(input: AuthSessionAssuranceInput<C>, now: number): AuthSessionAssurance;
}
