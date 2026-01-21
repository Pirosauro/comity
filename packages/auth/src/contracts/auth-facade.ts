import type { CreateSessionInput } from "../use-cases/session-create.js";
import type { RefreshSessionInput } from "../use-cases/session-refresh.js";
import type { RevokeSessionInput } from "../use-cases/session-revoke.js";
import type { StepUpSessionInput } from "../use-cases/session-step-up.js";
import type { AuthSession } from "./session.js";

/**
 * Authentication facade contract.
 */
export interface AuthFacade {
  /** Create a new authenticated session */
  createSession(input: CreateSessionInput, now: number): Promise<AuthSession>;

  /** Validate an existing session */
  assertSession(session: AuthSession, now: number): void;

  /** Refresh an existing session */
  refreshSession(input: RefreshSessionInput, now: number): Promise<AuthSession>;

  /** Revoke an existing session */
  revokeSession(input: RevokeSessionInput, now: number): Promise<void>;

  /** Perform step-up authentication */
  stepUpSession(input: StepUpSessionInput, now: number): Promise<AuthSession>;
}
