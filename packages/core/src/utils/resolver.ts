import type { ModuleMeta } from "../types.js";
import { ValidationError } from "../errors/validation.js";

/**
 * Resolves and reorders modules based on their dependency relationships.
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
 * @param modules - Array of module metadata objects to sort
 * @returns Modules sorted in dependency order (dependencies first)
 *
 * @throws {ValidationError}
 * Thrown when circular dependencies are detected or required dependencies are missing
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
 *
 * @example
 * Handling complex dependency graphs
 * ```typescript
 * const modules = [
 *   { name: 'frontend', dependsOn: ['api', 'auth'] },
 *   { name: 'api', dependsOn: ['database', 'cache'] },
 *   { name: 'auth', dependsOn: ['database', 'email'] },
 *   { name: 'email', dependsOn: ['config'] },
 *   { name: 'cache', dependsOn: ['config'] },
 *   { name: 'database', dependsOn: ['config'] },
 *   { name: 'config', dependsOn: [] }
 * ];
 *
 * const resolved = resolveModuleOrder(modules);
 * // Result: [config, database, cache, email, auth, api, frontend]
 * ```
 *
 * @example
 * Error handling for missing dependencies
 * ```typescript
 * const modules = [
 *   { name: 'app', dependsOn: ['missing-module'] },
 *   { name: 'database', dependsOn: [] }
 * ];
 *
 * try {
 *   resolveModuleOrder(modules);
 * } catch (error) {
 *   console.error(error.message);
 *   // "Missing dependency: missing-module (used in app)"
 * }
 * ```
 *
 * @example
 * Error handling for circular dependencies
 * ```typescript
 * const modules = [
 *   { name: 'moduleA', dependsOn: ['moduleB'] },
 *   { name: 'moduleB', dependsOn: ['moduleC'] },
 *   { name: 'moduleC', dependsOn: ['moduleA'] }
 * ];
 *
 * try {
 *   resolveModuleOrder(modules);
 * } catch (error) {
 *   console.error(error.message);
 *   // "Cycle detected: moduleA -> moduleB -> moduleC -> moduleA"
 * }
 * ```
 */
export function resolveModuleOrder(
  modules: ModuleMeta<any, any>[]
): ModuleMeta<any, any>[] {
  const result: ModuleMeta[] = [];
  const visited = new Set<string>();

  // Sort modules by priority first (ascending, default 100)
  modules.sort((a, b) => (a.priority || 100) - (b.priority || 100));

  // Helper function to perform DFS and detect cycles
  const visit = (mod: ModuleMeta, stack: string[] = []) => {
    // If already visited, skip
    if (visited.has(mod.name)) return;

    // If in the current stack, we have a cycle
    if (stack.includes(mod.name)) {
      throw new ValidationError("Module dependency cycle detected", {
        cycle: [...stack, mod.name],
      });
    }

    stack.push(mod.name);

    const dependencies = Array.from(
      new Set([...(mod.dependsOn || []), ...(mod.optionalDependsOn || [])])
    );

    // Visit dependencies first
    for (const dep of dependencies) {
      if (dep === mod.name) {
        throw new ValidationError("Module cannot depend on itself", {
          module: mod.name,
        });
      }

      const parent = modules.find((m) => m.name === dep);

      // If dependency not found and not optional, throw error
      if (!parent && !(mod.optionalDependsOn || []).includes(dep)) {
        throw new ValidationError("Missing module dependency", {
          module: mod.name,
          dependency: dep,
        });
      }

      if (parent) {
        visit(parent, stack);
      }
    }

    // Add the current module to the result
    visited.add(mod.name);
    result.push(mod);
  };

  // Visit each module
  for (const mod of modules) {
    visit(mod);
  }

  return result;
}
