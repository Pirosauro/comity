import type { AuthSession } from "@comity/auth";
import type { JoseJwtPayload } from "../contracts/jwt-payload.js";

/**
 * Converts an AuthSession into a JOSE JWT payload.
 *
 * @param session The auth session
 * @returns Jose JWT payload
 *
 * @remarks
 * Pure mapping function:
 * - no signing
 * - no validation
 * - no mutation
 */
export function authSessionToJwtPayload(session: AuthSession): JoseJwtPayload {
  const payload: JoseJwtPayload = {
    sid: session.id,
    iat: Math.floor(session.createdAt / 1000),
    ass: session.assurance,
  };

  // Expiration time
  if (session.expiresAt !== undefined) {
    payload.exp = Math.floor(session.expiresAt / 1000);
  }

  // Verification time
  if (session.verifiedAt !== undefined) {
    payload.vat = Math.floor(session.verifiedAt / 1000);
  }

  // Refresh info
  if (session.refresh !== undefined) {
    payload.refresh = {
      enabled: session.refresh.enabled,
    };

    if (session.refresh.expiresAt) {
      payload.refresh.exp = Math.floor(session.refresh.expiresAt / 1000);
    }
  }

  // Step-up info
  if (session.stepUp !== undefined) {
    payload.stepUp = {
      parent: session.stepUp.parent,
      at: Math.floor(session.stepUp.at / 1000),
    };
  }

  // Scopes
  if (session.scopes !== undefined) {
    payload.scopes = session.scopes;
  }

  return payload;
}
