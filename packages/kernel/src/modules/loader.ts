import type { Result } from "@comity/primitives/result";
import type { Kernel } from "../kernel.js";
import type { ModuleMeta } from "./types.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { ModuleLoadError } from "../errors/module-load.js";
import { resolveModuleOrder } from "./resolver.js";

/**
 * Load and apply modules to the kernel
 *
 * @param kernel Target kernel
 * @param modules Modules to load
 * @param options Module-specific options
 *
 * @returns Result indicating success or failure of the loading process
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
export async function loadModules(
  kernel: Kernel<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>,
  modules: readonly ModuleMeta[],
  options: Record<string, Record<string, unknown>> = {}
): Promise<Result<void, ModuleLoadError>> {
  const ordered = resolveModuleOrder(modules);

  // Handle module resolution errors
  if (isFailure(ordered)) {
    return failure(
      new ModuleLoadError({
        reason: "resolution-failed",
        cause: ordered.error,
      })
    );
  }

  const ctx = kernel.createModuleSetupContext();

  for (const mod of ordered.value) {
    // Setup
    const setup = await mod.setup(options[mod.name]);

    // Handle setup function retrieval errors
    if (isFailure(setup)) {
      return failure(
        new ModuleLoadError({
          reason: "setup-failed",
          module: mod.name,
          cause: setup.error,
        })
      );
    }

    // Apply
    const result = await setup.value(ctx);

    // Handle application errors
    if (isFailure(result)) {
      return failure(
        new ModuleLoadError({
          reason: "apply-failed",
          module: mod.name,
          cause: result.error,
        })
      );
    }
  }

  // Seal the kernel to prevent further modifications
  kernel.seal();

  return success(undefined);
}
