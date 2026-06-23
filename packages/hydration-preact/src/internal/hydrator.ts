import type { IslandContract, IslandHydrationAdapter } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";
import type { ComponentType } from "preact";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { HydrationError } from "@comity/hydration/error";
import { createElement, hydrate, render } from "preact";

/**
 *
 */
export class PreactIslandHydrationAdapter implements IslandHydrationAdapter {
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

    const vnode = createElement(
      component as ComponentType<Record<string, unknown>>,
      contract.data as Record<string, unknown>
    );
    const mountTarget =
      (island.querySelector("[data-comity-root]") as Element | null) ?? island;

    // Apply hydration strategy
    if (contract.mode === "client-only") {
      render(vnode, mountTarget);

      return;
    }

    // default: hydrate existing SSR markup
    hydrate(vnode, mountTarget);
  }
}
