export type { AuthFacade } from "./contracts/auth-facade.js";
export type { Identity, IdentityId } from "./contracts/identity.js";
export type {
  AssuranceScoreModifier,
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "./contracts/session-assurance-evaluator.js";
export type { AuthSessionAssurancePolicy } from "./contracts/session-assurance-policy.js";
export type {
  AuthSessionAssurance,
  AuthSessionAssuranceContext,
  AuthSessionAssuranceScore,
} from "./contracts/session-assurance.js";
export type {
  AuthSessionCommands,
  AuthSessionRevocation,
} from "./contracts/session-commands.js";
export type { AuthSessionRefreshPolicy } from "./contracts/session-refresh-policy.js";
export type { AuthSessionRepository } from "./contracts/session-repository.js";
export type { AuthSessionRevocationPolicy } from "./contracts/session-revocation-policy.js";
export type { AuthSessionTransport } from "./contracts/session-transport.js";
export type { AuthSession } from "./contracts/session.js";
export type { AuthTokenService } from "./contracts/token-service.js";

export { CompositeAssuranceEvaluator } from "./composite-evaluator.js";
export { AuthGuard } from "./guard.js";
export { AuthSessionId } from "./value-objects/auth-session-id.js";
