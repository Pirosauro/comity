import type { AuthSession } from "@comity/auth";
import type { JoseJwtPayload } from "../types.js";

/**
 * Converts a JOSE JWT payload into an AuthSession.
 *
 * @param payload The JOSE JWT payload to convert.
 *
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
  const refresh = payload.refresh
    ? {
        enabled: payload.refresh.enabled,
        ...(payload.refresh.exp ? { expiresAt: payload.refresh.exp * 1000 } : {}),
      }
    : undefined;
  const stepUp = payload.stepUp
    ? {
        parent: payload.stepUp.parent,
        at: payload.stepUp.at * 1000,
      }
    : undefined;

  return {
    id: payload.sid,
    transport: { type: "jwt" },
    createdAt: payload.iat * 1000,
    assurance: payload.ass,
    verifiedAt: (payload?.vat ? payload.vat : payload.iat) * 1000,
    ...(payload.exp ? { expiresAt: payload.exp * 1000 } : {}),
    ...(refresh ? { refresh } : {}),
    ...(stepUp ? { stepUp } : {}),
    ...(payload.scopes ? { scopes: payload.scopes } : {}),
  };
}
