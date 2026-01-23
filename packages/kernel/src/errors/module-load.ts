import type { ModuleLoadErrorMeta } from "./types.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Module load error
 *
 * @remarks
 * Represents errors that occur during the loading of modules in the kernel.
 * Includes reasons such as resolution failures, setup failures, and application failures.
 *
 * @example
 * ```typescript
 * import { ModuleLoadError } from "@comity/kernel/errors/module-load";
 *
 * throw new ModuleLoadError({
 *   reason: "setup_failed",
 *   module: "auth-module",
 *   cause: new Error("Database connection failed"),
 * });
 * ```
 */
export class ModuleLoadError extends BaseError {
  /** Error code */
  readonly code = "kernel:module-load";

  /**
   * @param meta Error metadata
   */
  constructor(meta: ModuleLoadErrorMeta) {
    super("Module load error", {
      httpStatus: 500, // Internal Server Error
      ...meta,
    });
  }
}
