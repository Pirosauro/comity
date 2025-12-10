import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  AuthModuleEvents,
  AuthModuleHonoContext,
  AuthModuleHooks,
  AuthModuleOptions,
  JWTPayload,
} from "./types.js";
import { jwtVerify } from "jose";
import { extractToken, getFailureReason } from "./utils/index.js";
import { JWTPayloadSchema } from "./validation/jwt-payload.js";

/**
 * Creates JWT authentication middleware.
 *
 * Simple middleware that:
 * 1. Extracts JWT from Authorization header or cookie
 * 2. Verifies token with JOSE
 * 3. Sets user context from token payload
 *
 * @param options - JWT configuration
 * @param ctx - Core context for logging
 * @returns Hono middleware
 *
 * @example
 * ```typescript
 * app.use('*', createJWTMiddleware({
 *   secret: 'your-secret',
 *   expiresIn: '1h'
 * }, ctx));
 *
 * app.get('/profile', (c) => {
 *   const user = c.get('user'); // Available after middleware
 *   return c.json({ userId: user?.id });
 * });
 * ```
 */
export const createJWTMiddleware = (
  options: AuthModuleOptions,
  ctx: ApplicationContext & LoggerModuleContext
): HonoMiddlewareHandler<AuthModuleHonoContext> => {
  const secret = new TextEncoder().encode(options.secret);
  const logger = ctx.logger.child({
    module: "@comity/auth",
  });

  return async (c, next) => {
    try {
      // Extract token from Authorization header or cookie
      const token = extractToken(c, options);

      if (!token) {
        // Emit authentication failed event for missing token
        await ctx.emit<AuthModuleEvents["@comity/auth:authentication-failed"]>(
          "@comity/auth:authentication-failed",
          {
            reason: "missing",
            context: "middleware",
            ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
            userAgent: c.req.header("user-agent"),
          }
        );

        // No token found - continue without user context
        return next();
      }

      // Verify JWT token
      const { payload } = await jwtVerify<JWTPayload>(token, secret, {
        issuer: options.issuer,
        audience: options.audience,
      });

      // Validate payload structure
      const validationResult = JWTPayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        await ctx.emit<AuthModuleEvents["@comity/auth:authentication-failed"]>(
          "@comity/auth:authentication-failed",
          {
            reason: "malformed",
            context: "middleware",
            ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
            userAgent: c.req.header("user-agent"),
          }
        );

        logger.error(validationResult.error, "Invalid JWT payload structure");
        return next();
      }

      const validatedPayload = validationResult.data;

      // Check if token is expired
      if (
        validatedPayload.exp &&
        validatedPayload.exp < Math.floor(Date.now() / 1000)
      ) {
        await ctx.emit<AuthModuleEvents["@comity/auth:token-expired"]>(
          "@comity/auth:token-expired",
          {
            user: validatedPayload.user,
            expiredAt: validatedPayload.exp,
            token,
          }
        );

        await ctx.emit<AuthModuleEvents["@comity/auth:authentication-failed"]>(
          "@comity/auth:authentication-failed",
          {
            reason: "expired",
            context: "middleware",
            userId: validatedPayload.sub,
            ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
            userAgent: c.req.header("user-agent"),
          }
        );

        return next();
      }

      await ctx.emit<AuthModuleEvents["@comity/auth:token-verified"]>(
        "@comity/auth:token-verified",
        validatedPayload
      );

      if (validatedPayload.sub) {
        // Trigger user hook for other modules
        await ctx.trigger<AuthModuleHooks["@comity/auth:user"]>(
          "@comity/auth:user",
          validatedPayload.user
        );

        // Set context
        c.set("user", validatedPayload.user);
      }
    } catch (error) {
      const message = (error as Error).message || "Unknown error";
      // Classify JOSE errors into specific auth error types
      const reason = getFailureReason(error as Error);

      await ctx.emit("@comity/auth:authentication-failed", {
        reason,
        context: "middleware",
        ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
        userAgent: c.req.header("user-agent"),
      });

      logger.error(error, `JWT verification failed: ${message}`);
    }

    return next();
  };
};
