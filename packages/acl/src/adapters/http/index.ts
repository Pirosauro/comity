/**
 * @comity/acl/adapters/http - HTTP Access Control Adapter
 *
 * Provides HTTP-compatible error handling for ACL operations.
 *
 * @remarks
 * What it offers:
 * - Exception-based ACL evaluation (throws on denial)
 * - HTTP status code mapping for ACL errors
 * - Framework-agnostic error responses
 *
 * What it deliberately excludes:
 * - HTTP server implementation
 * - Response serialization
 * - Authentication (handled by auth module)
 *
 * @example
 * ```typescript
 * import { createHttpAclHandler } from "@comity/acl/adapters/http";
 *
 * const handler = createHttpAclHandler(orchestrator);
 *
 * try {
 *   await handler.can(request);
 *   // Access granted
 * } catch (error) {
 *   // Access denied - error contains HTTP status
 *   res.status(error.status).json(error.body);
 * }
 * ```
 */

export * from "./error-mapper.js";
export * from "./handler.js";
