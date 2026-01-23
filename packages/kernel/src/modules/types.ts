import type { BaseError } from "@comity/core/errors";
import type { Result } from "@comity/core/result";
import type { ModuleSetupContext } from "../types.js";

/**
 * Module setup function
 */
export type ModuleSetupFn = (ctx: ModuleSetupContext) => Promise<Result<void, BaseError>>;

/**
 * Module metadata
 */
export interface ModuleMeta<
  Options extends { [K in keyof Options]: unknown } = Record<string, unknown>,
> {
  /** Unique module identifier */
  readonly name: string;

  /** Semantic version */
  readonly version: string;

  /** Load priority (lower loads first, default 100) */
  readonly priority?: number;

  /** Hard dependencies */
  readonly dependsOn?: readonly string[];

  /** Optional dependencies */
  readonly optionalDependsOn?: readonly string[];

  /** Incompatible modules */
  readonly incompatibleWith?: readonly string[];

  /**
   * Setup factory
   *
   * Called during module loading.
   * Must be pure and side-effect free.
   */
  readonly setup: (options?: Options) => Promise<Result<ModuleSetupFn, BaseError>>;
}
