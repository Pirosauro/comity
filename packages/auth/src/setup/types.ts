import type { AuthSessionAssuranceEvaluator } from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionAssurancePolicy } from "../contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "../contracts/session-refresh-policy.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionRevocationPolicy } from "../contracts/session-revocation-policy.js";
import type { AuthEvaluationEmitter } from "../events/evaluation.js";
import type { AuthRefreshEvaluationEmitter } from "../events/refresh.js";
import type { AuthSessionEmitter } from "../events/session.js";

/** Hooks exposed by the module */
export type AuthModuleHooks = {
  /** Executed when the auth module is initialized. */
  "@comity/auth:initialized": {
    /** Token of the initialized auth facade */
    token: string;
  };
};

/** Events emitted by the module */
export type AuthModuleEvents = {
  /** Emitted when a session passes all validation checks */
  "@comity/auth:session_validated": Parameters<AuthEvaluationEmitter["sessionValidated"]>[0];

  /** Emitted when assurance requirements are not met */
  "@comity/auth:assurance_rejected": Parameters<AuthEvaluationEmitter["assuranceRejected"]>[0];

  /** Emitted when a session fails validation */
  "@comity/auth:session_invalid": Parameters<AuthEvaluationEmitter["sessionInvalid"]>[0];

  /** Emitted when a refresh request passes validation */
  "@comity/auth:refresh_validated": Parameters<AuthRefreshEvaluationEmitter["refreshValidated"]>[0];

  /** Emitted when a refresh request is rejected */
  "@comity/auth:refresh_rejected": Parameters<AuthRefreshEvaluationEmitter["refreshRejected"]>[0];

  /** Emitted after a new session is successfully created */
  "@comity/auth:session_created": Parameters<AuthSessionEmitter["sessionCreated"]>[0];

  /** Emitted after a session is successfully refreshed */
  "@comity/auth:session_refreshed": Parameters<AuthSessionEmitter["sessionRefreshed"]>[0];

  /** Emitted after a session is successfully revoked */
  "@comity/auth:session_revoked": Parameters<AuthSessionEmitter["sessionRevoked"]>[0];

  /** Emitted after step-up authentication is successfully completed */
  "@comity/auth:step_up_completed": Parameters<AuthSessionEmitter["stepUpCompleted"]>[0];
};

/** Auth module setup options */
export type AuthModuleOptions = {
  /** Session repository */
  repository: AuthSessionRepository;

  /** Assurance evaluator */
  evaluator: AuthSessionAssuranceEvaluator;

  /** Guard policies */
  guard?: {
    /** Assurance policy */
    assurance?: AuthSessionAssurancePolicy;

    /** Refresh policy */
    refresh?: AuthSessionRefreshPolicy;

    /** Revocation policy */
    revocation?: AuthSessionRevocationPolicy;
  };
};
