import type { HydrationContext } from "./context.js";
import type { ComityIslandElement } from "./element.js";

import { idle } from "./strategies/idle.js";
import { immediate } from "./strategies/immediate.js";
import { interaction } from "./strategies/interaction.js";
import { media } from "./strategies/media.js";
import { visible } from "./strategies/visible.js";

/**
 * Hydrates all Comity islands on the page
 *
 * @param ctx Hydration context
 */
export async function hydrateIslands(ctx: HydrationContext): Promise<void> {
  ctx.events.emit("@comity/hydration:start", undefined);

  const islands =
    document.querySelectorAll<ComityIslandElement>("comity-island");

  islands.forEach((elem) => {
    const contract = elem.contract;

    try {
      // Basic validation
      if (typeof contract !== "object" || contract === null) {
        throw new Error("Contract is not an object");
      }

      // Validate required properties
      if (!("name" in contract) || typeof contract.name !== "string") {
        throw new Error("Missing or invalid 'name' property");
      }

      // Validate strategy property
      if (
        !("strategy" in contract) ||
        typeof contract.strategy !== "object" ||
        contract.strategy === null ||
        !("type" in contract.strategy)
      ) {
        throw new Error("Missing or invalid 'strategy' property");
      }
    } catch (error) {
      // Handle invalid contracts
      // Emit error event for invalid contract
      ctx.events.emit("@comity/hydration:island_error", {
        reason: "invalid_contract",
        error: new Error("Invalid island contract"),
      });

      return;
    }

    // Get the island loader
    const loader = ctx.registry.get(contract.name);

    // Handle unregistered islands
    if (!loader) {
      // Emit error event for unregistered island
      ctx.events.emit("@comity/hydration:island_error", {
        name: contract.name,
        strategy: contract.strategy,
        reason: "not_registered",
        error: new Error(`Island "${contract.name}" not registered`),
      });

      return;
    }

    /**
     * Runs the hydration process
     */
    const run = async () => {
      let success: boolean | undefined = undefined;
      const start = performance.now();

      // Emit island hydration start event
      ctx.events.emit("@comity/hydration:island_start", {
        name: contract.name,
        strategy: contract.strategy,
      });

      try {
        // Load the island module
        const { default: hydrate } = await loader();

        // Perform hydration
        await hydrate(contract.data, elem);

        success = true;
      } catch (error) {
        success = false;

        // Emit error event for hydration failure
        ctx.events.emit("@comity/hydration:island_error", {
          name: contract.name,
          strategy: contract.strategy,
          reason: "hydrate_failed",
          error,
        });
      }

      // Emit island hydration complete event
      ctx.events.emit("@comity/hydration:island_complete", {
        name: contract.name,
        strategy: contract.strategy,
        success,
        duration: performance.now() - start,
      });
    };

    switch (contract.strategy.type) {
      case "immediate":
        immediate(run);
        break;

      case "interaction":
        if (
          typeof contract.strategy.options === "object" &&
          Array.isArray(contract.strategy.options)
        ) {
          interaction(contract.strategy.options, elem, run);
        }
        break;

      case "media":
        if (typeof contract.strategy.options === "string") {
          media(contract.strategy.options, run);
        }
        break;

      case "visible":
        visible(elem, run);
        break;

      case "idle":
        idle(run);
        break;

      default:
        // No hydration
        break;
    }
  });

  ctx.events.emit("@comity/hydration:scheduled", undefined);
}
