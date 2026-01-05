import type { Result, ResultValue } from "../core/types.js";
import type { AuthService } from "../core/auth-service.js";
import type { AuthSessionInvariantReason } from "../core/invariants.js";
import type { AuthSessionValidationReason } from "../core/validation.js";
import type { AuthCredentialExtractor } from "../ports/credential-extractor.js";
import type { AuthContextResolver } from "../ports/context-resolver.js";
import type { AuthContext } from "../ports/context.js";

export const AUTH_ORCHESTRATOR_REASONS = {
  INVALID_CREDENTIAL: "auth:invalid_credential",
} as const;

export type AuthOrchestratorReason =
  (typeof AUTH_ORCHESTRATOR_REASONS)[keyof typeof AUTH_ORCHESTRATOR_REASONS];

export type AuthorizeDecision = ResultValue<
  ReturnType<AuthService["authorize"]>
>;

export type RefreshDecision = ResultValue<ReturnType<AuthService["refresh"]>>;

export interface OrchestratorOptions<
  R,
  I extends Record<string, unknown>,
  S extends Record<string, unknown>,
  E extends string
> {
  authService: AuthService;

  credentialExtractor: AuthCredentialExtractor<R>;

  contextResolver: AuthContextResolver<I, S, E>;

  now?: () => number;
}

export class AuthOrchestrator<
  R,
  I extends Record<string, unknown>,
  S extends Record<string, unknown>,
  E extends string
> {
  private readonly now: () => number;

  constructor(private readonly options: OrchestratorOptions<R, I, S, E>) {
    this.now = options.now ?? (() => Math.floor(Date.now() / 1000));
  }

  async authorize(
    request: R,
    requirement = {}
  ): Promise<
    Result<
      {
        context: AuthContext<S, I>;
        decision: AuthorizeDecision;
      },
      | E
      | AuthOrchestratorReason
      | AuthSessionInvariantReason
      | AuthSessionValidationReason
    >
  > {
    const now = this.now();
    // 1. Extract credentials
    const credential = this.options.credentialExtractor.extract(request);

    if (!credential) {
      return {
        ok: false,
        reason: AUTH_ORCHESTRATOR_REASONS.INVALID_CREDENTIAL,
      };
    }

    // 2. Resolve context
    const resolved = await this.options.contextResolver.resolve(
      credential,
      now
    );

    // Propagate resolution errors
    if (!resolved.ok) return resolved;

    // 3. Authorize
    const decision = this.options.authService.authorize(
      resolved.value.session,
      requirement,
      now
    );

    // Propagate authorization errors
    if (!decision.ok) return decision;

    return {
      ok: true,
      value: {
        context: resolved.value,
        decision: decision.value!,
      },
    };
  }

  async refresh(
    request: R,
    requirement = {}
  ): Promise<
    Result<
      {
        context: AuthContext<S, I>;
        decision: RefreshDecision;
      },
      | E
      | AuthOrchestratorReason
      | AuthSessionInvariantReason
      | AuthSessionValidationReason
    >
  > {
    const now = this.now();
    // 1. Extract credentials
    const credential = this.options.credentialExtractor.extract(request);

    if (!credential) {
      return {
        ok: false,
        reason: AUTH_ORCHESTRATOR_REASONS.INVALID_CREDENTIAL,
      };
    }

    // 2. Resolve context
    const resolved = await this.options.contextResolver.resolve(
      credential,
      now
    );

    // Propagate resolution errors
    if (!resolved.ok) return resolved;

    // 3. Refresh
    const decision = this.options.authService.refresh(
      resolved.value.session,
      requirement,
      now
    );

    // Propagate refresh errors
    if (!decision.ok) return decision;

    return {
      ok: true,
      value: {
        context: resolved.value,
        decision: decision.value!,
      },
    };
  }
}
