import type { IslandContract, IslandHydrationAdapter } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";
import type { Attributes } from "react";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { HydrationError } from "@comity/hydration/errors";
import { createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

/**
 *
 */
export class ReactIslandHydrationAdapter implements IslandHydrationAdapter {
  /** */
  #registry: IslandComponentRegistry;

  /**
   * @param registry - The registry of island components
   */
  constructor(registry: IslandComponentRegistry) {
    this.#registry = registry;
  }

  /**
   * @inheritDoc
   */
  supports(contract: IslandContract): boolean {
    if (!contract.component) return false;

    // Supports all registered components and strategies
    return true;
  }

  /**
   * @inheritdoc
   */
  async hydrate(island: IslandElement, contract: IslandContract): Promise<void> {
    const loader = this.#registry[contract.component];

    if (!loader) {
      throw new HydrationError("not_registered", {
        details: {
          component: contract.component,
        },
      });
    }

    const { default: component } = await loader();

    if (!component) {
      throw new HydrationError("invalid_component", {
        details: {
          component: contract.component,
        },
      });
    }

    // Apply hydration strategy
    if (contract.mode === "client-only") {
      createRoot(island).render(createElement(component, contract.data as Attributes));

      return;
    }

    // default: hydrate existing SSR markup
    hydrateRoot(island, createElement(component, contract.data as Attributes));
  }
}
