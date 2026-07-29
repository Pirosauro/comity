import type { BaseError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";

/**
 * Application result type, representing the outcome of an application operation.
 */
export type ApplicationResult<T = unknown> = Result<T, BaseError, "ok">;
