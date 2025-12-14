import type {
  ApplicationContext,
  ApplicationService,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { WorkspaceModuleHonoContext } from "@comity/workspace";
import type { PostgresModuleHonoContext } from "@comity/postgres";
import type {
  SlugModuleHonoContext,
  SlugModuleOptions,
  SlugModuleResolvedEvent,
} from "./types.js";
import type { SlugRepository } from "./repositories/slug.js";
import { createMongoAbility } from "@casl/ability";
import { NotFoundError } from "@comity/core/errors";

import {
  readSlugBySource,
  readSlugBySourceOrTarget,
} from "./use-cases/slug/read.js";

export const createSlugMiddleware = (
  options: SlugModuleOptions = {},
  ctx: ApplicationContext & LoggerModuleContext,
  app: ApplicationService
): HonoMiddlewareHandler<
  SlugModuleHonoContext & PostgresModuleHonoContext & WorkspaceModuleHonoContext
> => {
  const logger = ctx.logger.child({ scope: "@comity/slug" });
  // Special ability allowing read access to Slug for middleware operations
  const ability = createMongoAbility([
    {
      action: "read",
      subject: "Slug",
    },
  ]);

  return async (c, next) => {
    const db = c.get("postgres")!;
    const workspace = c.get("workspace")!;

    try {
      // Fallback to database lookup if no environment binding exists
      const slug = options.redirectOnTargetMatch
        ? await readSlugBySourceOrTarget(
            c.req.path,
            workspace.id,
            db.getRepository<SlugRepository>("slug"),
            ability
          )
        : await readSlugBySource(
            c.req.path,
            workspace.id,
            db.getRepository<SlugRepository>("slug"),
            ability
          );

      // Log the resolved slug for debugging
      logger.debug({ slug }, `Resolved slug for path '${c.req.path}'`);

      // Emit an event after channel resolution
      await ctx.emit<SlugModuleResolvedEvent>("@comity/slug:resolved", {
        slug,
      });

      // Handle internal redirect if source matches target and configured
      if (options.redirectOnTargetMatch && slug.target === c.req.path) {
        return c.redirect(slug.source!, 301);
      }

      // Handle redirect if configured
      if (slug.redirect) {
        return c.redirect(slug.target!, slug.redirect === 1 ? 301 : 302);
      }

      return app.request(slug.target!);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        logger.error({ error }, "Error initializing slug middleware");
      }
    }

    return next();
  };
};
