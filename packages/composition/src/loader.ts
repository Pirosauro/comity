import type { Kernel } from "@comity/kernel";
import type { Result } from "@comity/primitives/result";
import type { ModuleMeta, ModuleSetupFn } from "./setup/types.js";

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
 * This function handles the loading and application of modules to the provided kernel
 * following the strict kernel lifecycle:
 *
 * 1. **resolveOrder** — compute the dependency order.
 * 2. **CONFIGURE** — reverse topological order: each module's `setup` runs declaratively
 *    (validate options, define services, define hooks, subscribe to events).
 * 3. **SEAL** — the kernel is sealed; the result is checked.
 * 4. **INITIALIZE** — forward topological order: each module's setup function runs and
 *    may resolve services, execute hooks, and emit events.
 * 5. **START** — the kernel is started; the result is checked.
 *
 * If any step fails, it returns a failure result with a detailed error.
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

  // Setup phase (CONFIGURE, reverse topological order)
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

  // Seal the kernel to prevent further modifications
  const sealResult = kernel.seal();

  if (isFailure(sealResult)) {
    return failure(
      new CompositionError("initialization_failed", {
        cause: sealResult.error,
      })
    );
  }

  // Init phase (INITIALIZE, forward topological order)
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

  // Start the kernel
  const startResult = kernel.start();

  if (isFailure(startResult)) {
    return failure(
      new CompositionError("initialization_failed", {
        cause: startResult.error,
      })
    );
  }

  return success(undefined);
}
