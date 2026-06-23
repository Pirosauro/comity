import type { IslandDiscoveryAdapter } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";

/**
 *
 */
export class DomIslandDiscoveryAdapter implements IslandDiscoveryAdapter {
  /** */
  #root: ParentNode;

  /** */
  #onDiscovered: (island: IslandElement) => void;

  /**
   *
   * @param root
   * @param controller
   * @param onDiscovered
   */
  constructor(root: ParentNode, onDiscovered: (island: IslandElement) => void) {
    this.#root = root;
    this.#onDiscovered = onDiscovered;
  }

  /**
   *
   */
  attach(): void {
    const islands = this.#root.querySelectorAll<IslandElement>("comity-island");

    islands.forEach((element) => {
      this.#onDiscovered(element);
    });
  }

  /**
   *
   */
  detach(): void {
    // Disconnect observers
  }
}
