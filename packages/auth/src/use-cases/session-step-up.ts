import type { AuthSession } from "../contracts/session.js";

/**
 * Step-Up Session Use Case Input
 */
export interface StepUpSessionInput {
  /**
   * Parent session that is being stepped up.
   */
  parent: AuthSession;

  /**
   * Current timestamp (ms)
   */
  now: number;
}

/**
 * Step-Up Session Use Case
 *
 * Adapter/application layer is responsible for:
 * - performing additional verification
 * - persisting and/or issuing the stepped-up session
 * - ensuring the resulting AuthSession satisfies invariants (including stepUp metadata)
 */
export interface StepUpSession {
  /**
   * Perform a step-up authentication flow, returning the new session representation.
   */
  execute(input: StepUpSessionInput): AuthSession;
}
