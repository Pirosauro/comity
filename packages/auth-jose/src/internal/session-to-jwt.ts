import type { AuthSession } from "@comity/auth";
import type { JoseJwtPayload } from "../types.js";

/**
 * Converts an AuthSession into a JOSE JWT payload.
 *
 * @param session - The auth session
 *
 * @returns Jose JWT payload
 *
 * @remarks
 * Pure mapping function:
 * - no signing
 * - no validation
 * - no mutation
 */
export function authSessionToJwtPayload(session: AuthSession): JoseJwtPayload {
  const refresh = session.refresh
    ? {
        enabled: session.refresh.enabled,
        ...(session.refresh.expiresAt ? { exp: Math.floor(session.refresh.expiresAt / 1000) } : {}),
      }
    : undefined;
  const stepUp = session.stepUp
    ? {
        parent: session.stepUp.parent.toString(),
        at: Math.floor(session.stepUp.at / 1000),
      }
    : undefined;

  return {
    sid: session.id.toString(),
    iat: Math.floor(session.createdAt / 1000),
    ass: session.assurance,
    ...(session.expiresAt ? { exp: Math.floor(session.expiresAt / 1000) } : {}),
    ...(session.verifiedAt ? { vat: Math.floor(session.verifiedAt / 1000) } : {}),
    ...(refresh ? { refresh } : {}),
    ...(stepUp ? { stepUp } : {}),
    ...(session.scopes ? { scopes: session.scopes as string[] } : {}),
  };
}
