import type { AuthSession } from "@comity/auth";
import type { JoseJwtPayload } from "../contracts/jwt-payload.js";

/**
 * Converts a JOSE JWT payload into an AuthSession.
 *
 * @param payload The JOSE JWT payload to convert.
 * @returns The mapped AuthSession.
 *
 * @remarks
 * Pure mapping function:
 * - no validation
 * - no policy
 * - no side effects
 *
 * Note: This function does NOT validate the payload. It assumes the payload
 * is already validated.
 */
export function jwtPayloadToAuthSession(payload: JoseJwtPayload): AuthSession {
  const session: AuthSession = {
    id: payload.sid,
    transport: "jwt",
    createdAt: payload.iat * 1000,
    assurance: payload.ass,
  };

  // Expiration time
  if (payload.exp) {
    session.expiresAt = payload.exp * 1000;
  }

  // Verification time
  if (payload.vat) {
    session.verifiedAt = payload.vat * 1000;
  }

  // Refresh info
  if (payload.refresh) {
    session.refresh = {
      enabled: payload.refresh.enabled,
    };

    if (payload.refresh.exp) {
      session.refresh.expiresAt = payload.refresh.exp * 1000;
    }
  }

  // Step-up info
  if (payload.stepUp) {
    session.stepUp = {
      parent: payload.stepUp.parent,
      at: payload.stepUp.at * 1000,
    };
  }

  // Scopes
  if (payload.scopes) {
    session.scopes = payload.scopes;
  }

  return session;
}
