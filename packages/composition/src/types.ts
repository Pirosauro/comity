import type { DiContainer } from "@comity/primitives/di";
import type { BaseError } from "@comity/primitives/errors";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";

/**
 * Module setup context.
 *
 * @remarks
 * This is the context object passed to Module setup functions. It can be extended in the future to include additional properties or services as needed.
 */
export interface ModuleSetupContext<
  Services extends Record<PropertyKey, unknown> = {},
  Events extends Record<string, unknown> = {},
  Hooks extends Record<string, unknown> = {},
> {
  /** Service container */
  readonly services: DiContainer<Services>;

  /** Event bus */
  readonly events: EventBus<Events>;

  /** Hook bus */
  readonly hooks: HookBus<Hooks>;
}

/**
 * Module setup function.
 */
export type ModuleSetupFn = () => Promise<Result<void, BaseError>>;

/**
 * Module metadata.
 */
export interface ModuleMeta<
  Options extends Record<string, unknown> = Record<string, unknown>,
  Context extends ModuleSetupContext = ModuleSetupContext,
> {
  /** Unique Module identifier */
  readonly name: string;

  /** Semantic version */
  readonly version: string;

  /** Load priority (lower loads first, default 100) */
  readonly priority?: number;

  /** Hard dependencies */
  readonly dependsOn?: Readonly<
    Record<
      string,
      {
        /** Version constraint */
        version?: string;

        /** Whether the dependency is optional */
        optional?: boolean;
      }
    >
  >;

  /** Incompatible Modules */
  readonly incompatibleWith?: readonly string[];

  /**
   * Setup factory.
   *
   * @remarks
   * Called during Module loading. Must be pure and side-effect free.
   */
  readonly setup: (ctx: Context, options?: Options) => Promise<Result<ModuleSetupFn, BaseError>>;
}
