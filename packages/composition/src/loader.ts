import type { Kernel } from "@comity/kernel";
import type { Result } from "@comity/primitives/result";
import type { ModuleMeta, ModuleSetupFn } from "./types.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { CompositionError } from "./errors/composition.js";
import { resolveOrder } from "./resolver.js";

/**
 * Load and apply modules to the kernel.
 *
 * @param kernel - Target kernel.
 * @param modules - Modules to load.
 * @param options - Module-specific options.
 *
 * @returns Result indicating success or failure of the loading process.
 *
 * @remarks
 * This function handles the loading and application of modules to the provided kernel.
 * It first resolves the correct loading order based on module dependencies, then
 * sequentially sets up each module using its setup function. If any step fails,
 * it returns a failure result with a detailed error.
 *
 * After all modules are successfully applied, the kernel is sealed to prevent further modifications.
 *
 * @example
 * ```typescript
 * const kernel = new Kernel();
 * const modules = [moduleA, moduleB, moduleC];
 * const result = await loadModules(kernel, modules);
 *
 * if (result.success) {
 *   console.log("Modules loaded successfully");
 * } else {
 *   console.error("Failed to load modules:", result.error);
 * }
 * ```
 */
export async function load(
  kernel: Kernel,
  modules: readonly ModuleMeta[],
  options: Record<string, Record<string, unknown>> = {}
): Promise<Result<void, CompositionError>> {
  const ordered = resolveOrder(modules);

  // Handle module resolution errors
  if (isFailure(ordered)) {
    return failure(
      new CompositionError("resolution_failed", {
        cause: ordered.error,
      })
    );
  }

  const initializers: {
    /** Module name */
    module: string;

    /** Module setup function */
    init: ModuleSetupFn;
  }[] = [];
  const ctx = {
    services: kernel.services,
    events: kernel.events,
    hooks: kernel.hooks,
  };

  // Setup phase (reverse)
  for (const mod of ordered.value.slice().reverse()) {
    // Setup
    const setup = await mod.setup(ctx, options[mod.name]);

    // Handle setup function retrieval errors
    if (isFailure(setup)) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: mod.name,
          },
          cause: setup.error,
        })
      );
    }

    initializers.push({ module: mod.name, init: setup.value });
  }

  // Init phase (forward)
  for (const { module, init } of initializers.reverse()) {
    // Initialize module
    const result = await init();

    // Handle initialization errors
    if (isFailure(result)) {
      return failure(
        new CompositionError("initialization_failed", {
          details: {
            module,
          },
          cause: result.error,
        })
      );
    }
  }

  // Seal the kernel to prevent further modifications
  kernel.seal();

  return success(undefined);
}
