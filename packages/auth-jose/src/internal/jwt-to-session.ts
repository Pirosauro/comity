import type { AuthSession } from "@comity/auth";
import { AuthSessionId } from "@comity/auth";
import type { Result } from "@comity/primitives/result";
import type { JoseJwtPayload } from "../types.js";

import { AuthError } from "@comity/auth/errors";
import { failure, isFailure, success } from "@comity/primitives/result";

/**
 * Converts a JOSE JWT payload into an AuthSession.
 *
 * @param payload The JOSE JWT payload to convert.
 *
 * @returns The mapped AuthSession, or an error when the payload violates the
 * session identifier contract.
 *
 * @remarks
 * Boundary mapper function:
 * - performs the Value Object creation boundary for identifiers
 * - propagates domain failures through Result
 * - no policy
 * - no side effects
 *
 * Note: This function does NOT validate the payload beyond the identifier
 * creation boundary. It assumes the payload is otherwise validated upstream.
 */
export function jwtPayloadToAuthSession(
  payload: JoseJwtPayload
): Result<AuthSession, AuthError> {
  const idResult = AuthSessionId.create(payload.sid);

  if (isFailure(idResult)) {
    return failure(
      new AuthError("token_invalid", {
        details: { violation: "session_id_missing" },
      })
    );
  }

  const refresh = payload.refresh
    ? {
        enabled: payload.refresh.enabled,
        ...(payload.refresh.exp ? { expiresAt: payload.refresh.exp * 1000 } : {}),
      }
    : undefined;

  const parentResult = payload.stepUp ? AuthSessionId.create(payload.stepUp.parent) : undefined;

  if (parentResult !== undefined && isFailure(parentResult)) {
    return failure(
      new AuthError("token_invalid", {
        details: { violation: "step_up_parent_invalid" },
      })
    );
  }

  const stepUp =
    payload.stepUp !== undefined && parentResult !== undefined
      ? {
          parent: parentResult.value,
          at: payload.stepUp.at * 1000,
        }
      : undefined;

  return success({
    id: idResult.value,
    transport: { type: "jwt" },
    createdAt: payload.iat * 1000,
    assurance: payload.ass,
    verifiedAt: (payload?.vat ? payload.vat : payload.iat) * 1000,
    ...(payload.exp ? { expiresAt: payload.exp * 1000 } : {}),
    ...(refresh ? { refresh } : {}),
    ...(stepUp ? { stepUp } : {}),
    ...(payload.scopes ? { scopes: payload.scopes } : {}),
  });
}