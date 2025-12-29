import type { ClaimRawRule } from "@casl/ability";
import type { AuthModuleContext, AuthModuleHonoContext } from "@comity/auth";
import type { LoggerModuleContext } from "@comity/logger";
import type { ChannelModuleHonoContext } from "@comity/channel";
import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { DatabaseModuleHonoContext } from "@comity/database";
import type { UserRoleRepository } from "./repositories/user-role.js";
import type {
  UserModuleEvents,
  UserModuleHonoContext,
  UserModuleOptions,
} from "./types.js";
import { createMongoAbility } from "@casl/ability";
import { listUserRolesByUserId } from "./use-cases/user-role/list.js";

/**
 * Creates middleware for automatic role resolution based on request user.
 *
 * This middleware implements a multi-tenant role system similar to Vendure's approach,
 * where each request is automatically associated with a role based on the user.
 * It supports two resolution strategies with automatic fallback:
 *
 * 1. **Environment/Binding Resolution**: Fast lookup using WEBSITES environment variable
 * 2. **Database Resolution**: Flexible lookup via website-to-channel relationships
 *
 * @param options - Configuration options for channel resolution behavior
 * @param logger - Pino logger instance for debugging and monitoring
 * @param emit - Event emission function for module lifecycle events
 *
 * @returns Hono middleware that resolves and sets channel context
 *
 * @remarks
 * **Resolution Strategy:**
 * - First attempts environment binding lookup (fastest)
 * - Falls back to database lookup if no binding exists
 * - Handles 404/403 errors gracefully by returning appropriate HTTP responses
 * - Re-throws unexpected errors for proper error handling
 *
 * **Performance Considerations:**
 * - Environment bindings provide sub-millisecond resolution
 * - Database lookups use read replicas when available
 * - Automatic caching via repository layer
 * - Minimal memory footprint with lazy repository instantiation
 *
 * **Domain Extraction:**
 * - Prioritizes `host` header (standard)
 * - Falls back to `x-forwarded-host` (proxy/load balancer scenarios)
 * - Strips port numbers automatically
 * - Defaults to 'localhost' for development
 *
 * **Event Emission:**
 * - Emits `@comity/channel:resolved` after successful resolution
 * - Includes resolution source, domain, and channel data
 * - Enables other modules to react to channel context establishment
 *
 * @example
 * Basic usage with environment bindings
 * ```typescript
 * import { createChannelMiddleware } from '@comity/channel';
 *
 * const app = new Hono<ChannelModuleHonoContext>();
 *
 * // Environment variable: WEBSITES='{"example.com":"channel-123"}'
 * app.use('*', createChannelMiddleware({}, logger, emit));
 *
 * app.get('/', (c) => {
 *   const channel = c.get('channel'); // Automatically resolved
 *   return c.json({ channelId: channel.id });
 * });
 * ```
 *
 * @example
 * Configuration with options and database fallback
 * ```typescript
 * const middleware = createChannelMiddleware(
 *   {
 *     websites: {
 *       'dev.example.com': 'dev-channel-456',
 *       'staging.example.com': 'staging-channel-789'
 *     }
 *   },
 *   logger,
 *   emit
 * );
 *
 * // Will use options.websites first, then database lookup
 * app.use('*', middleware);
 * ```
 *
 * @example
 * Error handling and monitoring
 * ```typescript
 * const middleware = createChannelMiddleware({}, logger, emit);
 *
 * app.use('*', middleware);
 *
 * // 404 automatically returned for unknown domains
 * // Errors logged with context: domain, resolution source, timing
 * ```
 *
 * @example
 * Event handling for module integration
 * ```typescript
 * const emit = async (event: string, payload: any) => {
 *   if (event === '@comity/channel:resolved') {
 *     console.log(`Channel ${payload.channel.code} resolved for ${payload.domain}`);
 *
 *     // Initialize channel-specific services
 *     await setupChannelServices(payload.channel);
 *   }
 * };
 *
 * app.use('*', createChannelMiddleware({}, logger, emit));
 * ```
 */
export const createUserMiddleware = (
  options: UserModuleOptions,
  ctx: ApplicationContext & AuthModuleContext & LoggerModuleContext
): HonoMiddlewareHandler<
  UserModuleHonoContext &
    DatabaseModuleHonoContext &
    AuthModuleHonoContext &
    ChannelModuleHonoContext
> => {
  const logger = ctx.logger.child({ module: "@comity/user" });

  return async (c, next) => {
    const db = c.get("db");
    const user = c.get("user");
    const channel = c.get("channel");

    // Special ability allowing read access to User for middleware operations
    const ability = createMongoAbility([
      {
        action: "read",
        subject: "UserRole",
      },
    ]);

    // Fetch the channel from the database to ensure it exists and is accessible
    const repository = db.get<UserRoleRepository>("userRole");

    try {
      const userRoles =
        user?.id && channel?.id
          ? await listUserRolesByUserId(
              user.id,
              channel.id,
              repository,
              ability,
              {
                columns: [
                  "userId",
                  "roleId",
                  "role.id",
                  "role.channelId",
                  "role.name",
                  "role.rules",
                ],
              }
            )
          : [];

      c.set(
        "ability",
        createMongoAbility(
          userRoles.flatMap(
            ({ role }) => (role?.rules as ClaimRawRule<any>) || []
          )
        )
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      logger.error({ error }, `Error initializing user middleware: ${message}`);
      ctx.emit<UserModuleEvents["@comity/user:error"]>("@comity/user:error", {
        error: error as Error,
      });
      // Fallback to empty ability on error
      c.set("ability", createMongoAbility([]));
    }

    return next();
  };
};
