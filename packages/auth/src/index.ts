/**
 * @comity/auth - Authentication & Authorization Module
 *
 * Provides a comprehensive, policy-driven authentication system for Comity applications.
 *
 * What it offers:
 * - Session management with assurance scoring and freshness validation
 * - Step-up authentication for elevated privileges
 * - Session refresh capabilities with configurable requirements
 * - Event emission for audit, monitoring, and integration
 * - Extensible adapter system for various auth methods (JWT, HTTP, etc.)
 *
 * What it deliberately excludes:
 * - Built-in user storage or management (handled by external systems)
 * - Specific transport mechanisms (HTTP, WebSocket, etc. - use adapters)
 * - Password hashing or credential validation (adapters handle specifics)
 * - UI components or forms (framework-specific)
 *
 * Usage:
 * ```typescript
 * import { module as authModule } from "@comity/auth";
 * import { JwtAdapter } from "@comity/auth/adapters/jwt";
 *
 * const app = createApp([
 *   authModule({
 *     orchestrator: new AuthOrchestrator({
 *       // configure adapters, policies, etc.
 *     })
 *   })
 * ]);
 *
 * const result = await app.auth.authorize(session, { minScore: 50 });
 * ```
 */

export * from "./core/assurance.js";
export * from "./core/auth-service.js";
export * from "./core/constants.js";
export * from "./core/invariants.js";
export * from "./core/policy.js";
export * from "./core/refresh.js";
export * from "./core/session.js";
export * from "./core/step-up.js";
export * from "./core/types.js";
export * from "./core/validation.js";
export * from "./setup/types.js";
