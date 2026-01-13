import type { Result } from "@comity/core/result";
import type { ModuleMeta } from "./types.js";

import { failure, isFailure, success } from "@comity/core/result";
import { ModuleResolutionError } from "../errors/module-resolution.js";

/**
 * Resolves and reorders modules based on their dependency relationships.
 *
 * @param input - Array of module metadata objects to sort
 * @returns Result containing modules sorted in dependency order (dependencies first) or an error
 *
 * @remarks
 * This function implements a topological sort algorithm to ensure modules are
 * ordered correctly based on their dependencies. It processes the dependency
 * graph to produce a linear ordering where dependencies always come before
 * the modules that depend on them.
 *
 * **Algorithm Details:**
 * - Uses depth-first search (DFS) with cycle detection
 * - Maintains a visited set to avoid reprocessing modules
 * - Tracks the current stack to detect circular dependencies
 * - Ensures each dependency is visited before the dependent module
 *
 * **Dependency Resolution Rules:**
 * - Dependencies must exist in the provided modules array
 * - Circular dependencies are detected and throw errors
 * - Modules without dependencies can appear in any order relative to each other
 * - The output order guarantees safe initialization sequence
 *
 * @example
 * Basic dependency resolution
 * ```typescript
 * const modules = [
 *   { name: 'app', dependsOn: ['auth', 'database'] },
 *   { name: 'auth', dependsOn: ['database'] },
 *   { name: 'database', dependsOn: [] }
 * ];
 *
 * const sorted = resolveModuleOrder(modules);
 * // Result: [database, auth, app]
 *
 * // Safe to initialize in this order:
 * for (const module of sorted) {
 *   await initializeModule(module);
 * }
 * ```
 */
export function resolveModuleOrder(
  input: ModuleMeta[] | readonly ModuleMeta[],
): Result<ModuleMeta[], ModuleResolutionError> {
  const result: ModuleMeta[] = [];
  const visited = new Set<string>();
  const modules = [...input].sort(
    // Sort modules by priority first (ascending, default 100)
    (a, b) => (a.priority || 100) - (b.priority || 100),
  );

  /**
   * Helper function to perform DFS and detect cycles
   *
   * @param mod Module metadata object
   * @param stack Current stack of module names for cycle detection
   * @returns Result indicating success or failure
   */
  const visit = (
    mod: ModuleMeta,
    stack: string[] = [],
  ): Result<void, ModuleResolutionError> => {
    // If already visited, skip
    if (visited.has(mod.name)) return success(undefined);

    // If in the current stack, we have a cycle
    if (stack.includes(mod.name)) {
      return failure(
        new ModuleResolutionError({
          reason: "cycle_detected",
          module: mod.name,
          cycle: [...stack, mod.name],
        }),
      );
    }

    // stack.push(mod.name);
    const next = [...stack, mod.name];

    const dependencies = Array.from(
      new Set([...(mod.dependsOn || []), ...(mod.optionalDependsOn || [])]),
    );

    // Visit dependencies first
    for (const dep of dependencies) {
      if (dep === mod.name) {
        return failure(
          new ModuleResolutionError({
            reason: "cycle_detected",
            module: mod.name,
            cycle: [mod.name],
          }),
        );
      }

      const parent = modules.find((m) => m.name === dep);

      // If dependency not found and not optional, throw error
      if (!parent && !(mod.optionalDependsOn || []).includes(dep)) {
        return failure(
          new ModuleResolutionError({
            reason: "missing_dependency",
            module: mod.name,
            dependency: dep,
          }),
        );
      }

      // Recursively visit dependency
      if (parent) {
        const result = visit(parent, next);

        // If visiting dependency failed, propagate error
        if (isFailure(result)) {
          return result;
        }
      }
    }

    // Add the current module to the result
    visited.add(mod.name);
    result.push(mod);

    return success(undefined);
  };

  // Visit each module
  for (const mod of modules) {
    const result = visit(mod);

    // If visiting module failed, propagate error
    if (isFailure(result)) {
      return result;
    }
  }

  return success(result);
}
