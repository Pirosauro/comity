import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { PostgresModuleHonoContext } from "@comity/postgres";
import type {
  WorkspaceRepository,
  WorkspaceResultColumns,
} from "./repositories/workspace.js";
import type {
  WorkspaceMiddlewareOptions,
  WorkspaceModuleEvents,
  WorkspaceModuleHonoContext,
} from "./types.js";
import { ZodError } from "zod";
import { createMongoAbility } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { readWorkspace } from "./use-cases/index.js";

/**
 * Workspace middleware for tenant/organization/workspace resolution
 *
 * This middleware can be extended to handle workspace context resolution
 * based on request headers, domains, or path parameters.
 */
export const createWorkspaceMiddleware = (
  options: WorkspaceMiddlewareOptions = {},
  ctx: ApplicationContext & LoggerModuleContext
): HonoMiddlewareHandler<
  PostgresModuleHonoContext & WorkspaceModuleHonoContext
> => {
  const logger = ctx.logger.child({ module: "@comity/workspace" });
  // Special ability allowing read access to Workspaces for middleware operations
  const ability = createMongoAbility([
    {
      action: "read",
      subject: "Workspace",
      conditions: {
        status: "active",
      },
    },
  ]);

  return async (c, next) => {
    const db = c.get("postgres");
    const host =
      c.req.header("host") || c.req.header("x-forwarded-host") || "localhost";
    const domain = host.split(":").find(() => true) || "localhost";

    try {
      // If options.websites are available, use it to get the workspace ID
      if (options.websites && options.websites[domain]) {
        const workspaceId = options.websites?.[domain];

        // Log the resolution source for monitoring
        logger.debug(
          { domain, workspaceId },
          "Workspace resolved via environment binding"
        );

        // Fetch the workspace from the database to ensure it exists and is accessible
        const repository = db.getRepository<WorkspaceRepository>("workspace");
        const workspace = await readWorkspace<WorkspaceResultColumns>(
          workspaceId!,
          repository,
          ability
        );

        if (!workspace) {
          throw new NotFoundError(
            `Workspace with id '${workspaceId}' not found.`
          );
        }

        // Emit an event after workspace resolution
        await ctx.emit<WorkspaceModuleEvents["@comity/workspace:resolved"]>(
          "@comity/workspace:resolved",
          {
            workspace,
            domain,
          }
        );

        c.set("workspace", workspace);

        return next();
      }

      throw new NotFoundError(`Workspace not defined for domain: ${domain}`);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, "Validation error during workspace resolution");

        return c.json({ error: "Invalid data format" }, 400);
      } else if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError
      ) {
        logger.error({ error }, `Workspace not found for domain: ${domain}`);

        return c.notFound();
      } else {
        logger.error({ error }, "Error initializing workspace from request");

        throw error;
      }
    }

    // await next();
  };
};

export default createWorkspaceMiddleware;
