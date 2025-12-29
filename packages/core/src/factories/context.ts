import type { ModuleMeta } from "../types.js";
import { Context } from "../context.js";
import { resolveModuleOrder } from "../utils/resolver.js";
import { moduleMetaSchema } from "../validation/module-meta.js";
import { ValidationError } from "../errors/validation.js";

/**
 * Bootstraps a Comity application by registering modules and setting up the runtime environment.
 *
 * @param modules - Array of module metadata objects to register and initialize
 * @param options - Configuration options keyed by module name, passed to each module's setup function
 * @returns Promise resolving to the initialized Context with all modules registered
 * @throws {ValidationError} When module metadata validation fails (invalid structure or missing required fields)
 * @throws {ValidationError} When circular dependencies are detected in module dependencies
 * @throws {ValidationError} When required dependencies are missing from the modules array
 *
 * @remarks
 * This function performs the following steps:
 * 1. Validates all module metadata using Zod schemas
 * 2. Resolves module dependencies using topological sorting
 * 3. Creates a new Context instance
 * 4. Initializes modules in dependency order, passing their configuration options
 *
 * Modules are initialized sequentially in dependency order to ensure all dependencies
 * are available when a module's setup function runs.
 *
 * @example
 * Basic usage with simple modules
 * ```typescript
 * const loggerModule = {
 *   name: "logger",
 *   version: "1.0.0",
 *   setup: async () => async (ctx) => {
 *     ctx.register("logger", () => new Logger());
 *   }
 * };
 *
 * const ctx = await createContext([loggerModule]);
 * const logger = ctx.get("logger");
 * ```
 *
 * @example
 * Complex module configuration with options
 * ```typescript
 * const dbModule = {
 *   name: "database",
 *   version: "1.0.0",
 *   setup: async (options) => async (ctx) => {
 *     const db = new Database(options.connectionString);
 *     ctx.register("db", () => db);
 *   }
 * };
 *
 * const ctx = await createContext([dbModule], {
 *   database: { connectionString: "postgresql://..." }
 * });
 * ```
 *
 * @example
 * Error handling for module validation
 * ```typescript
 * try {
 *   const ctx = await createContext(modules);
 * } catch (error) {
 *   if (error.name === "ZodError") {
 *     console.error("Module validation failed:", error.errors);
 *   } else {
 *     console.error("Module initialization failed:", error.message);
 *   }
 * }
 * ```
 */
export async function createContext(
  modules: ModuleMeta[],
  options: Record<string, any> = {}
): Promise<Context> {
  // Sort modules based on dependencies
  modules = resolveModuleOrder(modules);

  const ctx = new Context();

  // Register modules
  for (const mod of modules) {
    try {
      moduleMetaSchema.parse(mod);
    } catch (cause) {
      throw new ValidationError("Invalid module metadata", {
        module: mod.name,
        cause,
      });
    }

    // Call the module's setup function
    const setup = await mod.setup(options[mod.name]);

    await setup(ctx);
  }

  return ctx;
}
