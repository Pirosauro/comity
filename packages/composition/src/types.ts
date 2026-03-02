import type { DiContainerLike } from "@comity/primitives/di";
import type { BaseError } from "@comity/primitives/error";
import type { EventBusLike, HookBusLike } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";

/**
 * Module setup context.
 *
 * @remarks
 * This is the context object passed to Module setup functions. It can be extended in the future to include additional properties or services as needed.
 */
export type ModuleSetupContext = {
  /** Service container */
  readonly services: DiContainerLike;

  /** Event bus */
  readonly events: EventBusLike;

  /** Hook bus */
  readonly hooks: HookBusLike;
};

/**
 * Module setup function.
 */
export type ModuleSetupFn = (ctx: ModuleSetupContext) => Promise<Result<void, BaseError>>;

/**
 * Module metadata.
 */
export interface ModuleMeta<
  Options extends { [K in keyof Options]: unknown } = Record<string, unknown>,
  Context extends ModuleSetupContext = ModuleSetupContext,
> {
  /** Unique Module identifier */
  readonly name: string;

  /** Semantic version */
  readonly version: string;

  /** Load priority (lower loads first, default 100) */
  readonly priority?: number;

  /** Hard dependencies */
  readonly dependsOn?: Record<
    string,
    {
      /** Version constraint */
      readonly version?: string;

      /** Whether the dependency is optional */
      readonly optional?: boolean;
    }
  >;

  /** Incompatible Modules */
  readonly incompatibleWith?: readonly string[];

  /**
   * Setup factory.
   *
   * @remarks
   * Called during Module loading. Must be pure and side-effect free.
   */
  readonly setup: (options?: Options) => Promise<Result<ModuleSetupFn, BaseError>>;
}
