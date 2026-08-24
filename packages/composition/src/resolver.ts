import type { Result } from "@comity/primitives/result";
import type { ModuleMeta } from "./setup/types.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { CompositionError } from "./errors/composition.js";

/**
 * Resolves and reorders compositions based on their dependency relationships.
 *
 * @param input - Array of composition metadata objects to sort.
 *
 * @returns Result containing compositions sorted in dependency order (dependencies first) or an error.
 *
 * @remarks
 * This function implements a topological sort algorithm to ensure compositions are
 * ordered correctly based on their dependencies. It processes the dependency
 * graph to produce a linear ordering where dependencies always come before
 * the compositions that depend on them.
 *
 * **Algorithm Details:**
 * - Uses depth-first search (DFS) with cycle detection
 * - Maintains a visited set to avoid reprocessing compositions
 * - Tracks the current stack to detect circular dependencies
 * - Ensures each dependency is visited before the dependent composition
 *
 * **Dependency Resolution Rules:**
 * - Dependencies must exist in the provided compositions array
 * - Circular dependencies are detected and reported as failures
 * - Compositions without dependencies can appear in any order relative to each other
 * - The output order guarantees safe initialization sequence
 *
 * @example
 * Basic dependency resolution
 * ```typescript
 * const extensions = [
 *   { name: 'app', dependsOn: ['auth', 'database'] },
 *   { name: 'auth', dependsOn: ['database'] },
 *   { name: 'database', dependsOn: [] }
 * ];
 *
 * const sorted = resolveOrder(extensions);
 * // Result: [database, auth, app]
 *
 * // Safe to initialize in this order:
 * for (const extension of sorted) {
 *   await initializeExtension(extension);
 * }
 * ```
 */
export function resolveOrder(input: readonly ModuleMeta[]): Result<ModuleMeta[], CompositionError> {
  const modules = [...input];
  // 1. Build map + detect duplicates
  const map = new Map<string, ModuleMeta>();

  for (const mod of modules) {
    if (map.has(mod.name)) {
      return failure(
        new CompositionError("resolution_failed", {
          details: {
            module: mod.name,
          },
        })
      );
    }
    map.set(mod.name, mod);
  }

  // 2. Validate incompatibilities
  for (const mod of modules) {
    for (const incompatible of mod.incompatibleWith ?? []) {
      if (map.has(incompatible)) {
        return failure(
          new CompositionError("incompatible", {
            details: {
              module: mod.name,
              dependency: incompatible,
            },
          })
        );
      }
    }
  }

  // 3. Topological sort (DFS)
  const result: ModuleMeta[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  /**
   * Helper function to perform DFS and detect cycles
   *
   * @param mod Module metadata object
   * @param stack Current stack of module names for cycle detection
   *
   * @returns Result indicating success or failure
   */
  const visit = (mod: ModuleMeta): Result<void, CompositionError> => {
    // Already processed
    if (visited.has(mod.name)) {
      return success(undefined);
    }

    // Cycle detected
    if (visiting.has(mod.name)) {
      return failure(
        new CompositionError("cycle_detected", {
          details: {
            module: mod.name,
            cycle: [...visiting, mod.name],
          },
        })
      );
    }

    visiting.add(mod.name);

    const dependencies = mod.dependsOn ?? {};

    for (const [depName, depConfig] of Object.entries(dependencies)) {
      if (depName === mod.name) {
        return failure(
          new CompositionError("cycle_detected", {
            details: {
              module: mod.name,
              cycle: [mod.name],
            },
          })
        );
      }

      const dependency = map.get(depName);

      if (!dependency) {
        if (!depConfig?.optional) {
          return failure(
            new CompositionError("missing_dependency", {
              details: {
                module: mod.name,
                dependency: depName,
              },
            })
          );
        }

        continue;
      }

      const depResult = visit(dependency);

      if (isFailure(depResult)) {
        return depResult;
      }
    }

    visiting.delete(mod.name);
    visited.add(mod.name);
    result.push(mod);

    return success(undefined);
  };

  // 4. Sort by priority
  const sortedByPriority = [...modules].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

  for (const mod of sortedByPriority) {
    const r = visit(mod);

    if (isFailure(r)) {
      return r;
    }
  }

  return success(result);
}
