import type { BaseError } from "@comity/core/errors";
import type { AuthSessionInvariantReason } from "../../core/invariants.js";
import type { AuthSessionValidationReason } from "../../core/validation.js";
import type { AuthJwtContextResolverReason } from "../jwt/context-resolver.js";
import type { AuthOrchestratorReason } from "../../application/orchestrator.js";

import {
  UnauthorizedError,
  ForbiddenError,
  UnprocessableEntityError,
} from "@comity/core/errors";

export function mapAuthErrorToHttp(
  reason:
    | AuthSessionInvariantReason
    | AuthSessionValidationReason
    | AuthJwtContextResolverReason
    | AuthOrchestratorReason
    | string
): BaseError {
  switch (reason) {
    // Credential / transport
    case "auth:invalid_credential":
    case "auth:jwt_invalid_credential":
    case "auth:jwt_token_expired":
    case "auth:jwt_token_invalid":
      return new UnauthorizedError(undefined, { reason });

    // Session structural problems → 422
    case "auth:session_id_missing":
    case "auth:created_at_invalid":
    case "auth:verified_at_invalid":
    case "auth:expires_at_invalid":
    case "auth:assurance_methods_empty":
      return new UnprocessableEntityError(undefined, { reason });

    // Valid session, but not sufficient
    case "auth:not_verified":
    case "auth:verification_too_old":
    case "auth:assurance_insufficient":
      return new ForbiddenError(undefined, { reason });

    default:
      // Fallback
      return new UnauthorizedError(undefined, { reason });
  }
}
