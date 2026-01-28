import type { IslandContract, IslandHydrationAdapter } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";
import type { Attributes } from "react";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { HydrationRuntimeErrorError } from "@comity/hydration/errors";
import { createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

/**
 *
 */
export class ReactIslandHydrationAdapter implements IslandHydrationAdapter {
  /** */
  #registry: IslandComponentRegistry;

  /**
   *
   * @param registry
   */
  constructor(registry: IslandComponentRegistry) {
    this.#registry = registry;
  }

  /**
   *
   * @param contract -
   */
  supports(contract: IslandContract): boolean {
    if (!contract.component) return false;

    // Supports all registered components and strategies
    return true;
  }

  /**
   *
   * @param island -
   * @param contract
   */
  async hydrate(island: IslandElement, contract: IslandContract): Promise<void> {
    const loader = this.#registry[contract.component];

    if (!loader) {
      throw new HydrationRuntimeErrorError("Unknown island component", {
        reason: "not_registered",
        component: contract.component,
      });
    }

    const { default: component } = await loader();

    if (!component) {
      throw new HydrationRuntimeErrorError("Invalid island component", {
        reason: "invalid_component",
        component: contract.component,
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
