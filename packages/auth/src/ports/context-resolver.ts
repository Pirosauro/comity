import type { Result } from "../core/types.js";
import type { AuthCredential } from "./credential.js";
import type { AuthContext } from "./context.js";

export interface AuthContextResolver<
  I extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  R extends string = string
> {
  resolve(
    credential: AuthCredential,
    now: number
  ): Promise<Result<AuthContext<S, I>, R>>;
}
