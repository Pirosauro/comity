import type { HydrationRuntimeEvents } from "../lifecycle/runtime.js";

/**
 * Hydration Module Hooks
 */
export interface HydrationModuleHooks {}

/**
 * Hydration Module Events
 */
export interface HydrationModuleEvents {
  /** Island Discovered */
  "@comity/hydration:island-discovered": Parameters<HydrationRuntimeEvents["islandDiscovered"]>[0];

  /** Island Hydration Started */
  "@comity/hydration:island-hydration-started": Parameters<
    HydrationRuntimeEvents["islandHydrationStarted"]
  >[0];

  /** Island Hydration Completed */
  "@comity/hydration:island-hydration-completed": Parameters<
    HydrationRuntimeEvents["islandHydrationCompleted"]
  >[0];

  /** Island Hydration Failed */
  "@comity/hydration:island-hydration-failed": Parameters<
    HydrationRuntimeEvents["islandHydrationFailed"]
  >[0];
}

/**
 * Hydration Module Options
 */
export interface HydrationModuleOptions {}

/**
 * Hydration Module Context
 */
export interface HydrationModuleContext {}
