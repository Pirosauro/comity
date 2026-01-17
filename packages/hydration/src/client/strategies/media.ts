import type { IslandHydrationMediaStrategy } from "../../contracts/island.js";

/**
 * Hydrates when a media query matches
 *
 * @param query The media query to match
 * @param run The function to run to perform hydration
 * @returns void
 */
export function media(
  query: IslandHydrationMediaStrategy["options"],
  run: () => Promise<void>,
): void {
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
