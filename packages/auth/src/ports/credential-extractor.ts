import type { AuthCredential } from "./credential.js";

export interface AuthCredentialExtractor<
  R, // Context (eg. Request-like type)
  O extends Record<string, unknown> = {}
> {
  extract(context: R, options?: O): AuthCredential | null;
}
