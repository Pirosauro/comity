import type { IslandHydrationStrategy } from "./island.js";

/**
 * Hydration lifecycle events
 */
export interface IslandHydrationEvents {
  /** Emitted when hydration starts */
  "@comity/hydration:start": void;

  /** Emitted when an island starts hydration */
  "@comity/hydration:island_start": {
    /** Island name */
    name: string;

    /** Hydration strategy used */
    strategy: IslandHydrationStrategy;
  };

  /** Emitted when an island encounters an error during hydration */
  "@comity/hydration:island_error": {
    /** Island name */
    name?: string;

    /** Hydration strategy used */
    strategy?: IslandHydrationStrategy;

    /** Reason for the error */
    reason: "not_registered" | "invalid_contract" | "hydrate_failed";

    /** Error encountered */
    error: unknown;
  };

  /** Emitted when an island completes hydration */
  "@comity/hydration:island_complete": {
    /** Island name */
    name: string;

    /** Hydration strategy used */
    strategy: IslandHydrationStrategy;

    /** Duration of the hydration process in milliseconds */
    duration: number;

    /** Whether hydration was successful */
    success?: boolean;
  };

  /** Emitted when hydration is scheduled */
  "@comity/hydration:scheduled": void;
}
