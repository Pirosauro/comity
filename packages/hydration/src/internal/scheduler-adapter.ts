import type { IslandElement } from "../client/island-element.js";
import type { HydrationSchedulingAdapter } from "../contracts/hydration-scheduler.js";
import type {
  HydrationInteractionStrategy,
  HydrationMediaStrategy,
} from "../contracts/strategy.js";

/**
 * Default strategy-based scheduler adapter.
 */
export class DefaultHydrationScheduler implements HydrationSchedulingAdapter {
  /** @inheritdoc */
  schedule(island: IslandElement, run: () => Promise<void>): void {
    const strategy = island.contract?.strategy;

    // If no strategy is defined, hydrate immediately
    if (!strategy) {
      run();

      return;
    }

    switch (strategy.kind) {
      case "idle":
        this.#idle(run);
        break;

      case "visible": {
        this.#visible(island, run);
        break;
      }

      case "interaction": {
        this.#interaction(strategy.options, island, run);
        break;
      }

      case "media": {
        this.#media(strategy.options, run);
        break;
      }

      case "immediate":
      default:
        run();
        break;
    }
  }

  /**
   * Idle hydration strategy.
   *
   * @param run - Function to run when the browser is idle
   */
  #idle(run: () => Promise<void>): void {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run);
    } else {
      setTimeout(run, 200);
    }
  }

  /**
   * Visible hydration strategy
   *
   * @param elem - Element to observe for visibility
   * @param run - Function to run when the element becomes visible
   */
  #visible(elem: IslandElement, run: () => Promise<void>): void {
    // Create an intersection observer
    const observer = new IntersectionObserver(([entry]) => {
      // Element is visible, disconnect observer and run the function
      if (entry?.isIntersecting) {
        observer.disconnect();
        run();
      }
    });

    // Start observing the element
    observer.observe(elem);
  }

  /**
   * Hydration strategy that hydrates an island upon user interaction
   *
   * @param events The user interaction events to listen for
   * @param elem The HTML element representing the island
   * @param run The function to run to perform hydration
   */
  #interaction(
    events: HydrationInteractionStrategy["options"],
    elem: IslandElement,
    run: () => Promise<void>
  ): void {
    /** Event handler for user interaction */
    const handler = () => {
      cleanup();
      run();
    };

    /** Cleans up event listeners */
    const cleanup = () => {
      events.forEach((event) => {
        elem.removeEventListener(event, handler);
      });
    };

    // Attach event listeners for the specified events
    events.forEach((event) => {
      elem.addEventListener(event, handler, { once: true });
    });
  }

  /**
   * Hydrates when a media query matches
   *
   * @param query The media query to match
   * @param run The function to run to perform hydration
   *
   * @returns void
   */
  #media(query: HydrationMediaStrategy["options"], run: () => Promise<void>): void {
    const mql = window.matchMedia(query);

    if (mql.matches) {
      run();

      return;
    }

    /**
     * Listener for media query changes
     *
     * @param evt Media query list event
     */
    const listener = (evt: MediaQueryListEvent) => {
      // If the media query does not match, do nothing
      if (!evt.matches) return;

      mql.removeEventListener("change", listener);
      run();
    };

    mql.addEventListener("change", listener);
  }
}
