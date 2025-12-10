import { Context } from "@comity/core/patterns";

/**
 * Application-specific context extending the core Context with module lifecycle management.
 *
 * @remarks
 * Extends the base {@link Context} from @comity/core/patterns to provide
 * application-specific functionality for Comity module initialization and communication.
 *
 * **Key Features:**
 * - **Dependency Injection**: Inherited from base Context for service management
 * - **Lifecycle Hooks**: Sequential processing with payload transformation
 * - **Event System**: Parallel notifications for side effects and logging
 * - **Module Communication**: Enables modules to interact during bootstrap and runtime
 *
 * **Usage in Module Setup:**
 * Modules receive an ApplicationContext instance during their setup phase,
 * allowing them to register hooks, events, and access shared services.
 *
 * @example
 * Basic module setup with ApplicationContext
 * ```typescript
 * export const myModule = {
 *   name: 'my-module',
 *   version: '1.0.0',
 *   setup: (options) => async (ctx: ApplicationContext) => {
 *     // Register lifecycle hook
 *     ctx.onHook('@comity/application:initialized', async (app) => {
 *       console.log('Application initialized!');
 *       return app;
 *     });
 *
 *     // Register event listener
 *     ctx.onEvent('user:created', async (user) => {
 *       await sendWelcomeEmail(user.email);
 *     });
 *
 *     // Register service
 *     ctx.register('userService', () => new UserService());
 *   }
 * };
 * ```
 *
 * @example
 * Accessing services from ApplicationContext
 * ```typescript
 * export const apiModule = {
 *   name: 'api',
 *   version: '1.0.0',
 *   dependsOn: ['userService'],
 *   setup: (options) => async (ctx: ApplicationContext) => {
 *     const userService = ctx.get<UserService>('userService');
 *
 *     ctx.onHook('@comity/application:initialized', async (app) => {
 *       app.get('/users', async (c) => {
 *         const users = await userService.getAll();
 *         return c.json(users);
 *       });
 *       return app;
 *     });
 *   }
 * };
 * ```
 */
export class ApplicationContext extends Context {
  // For future extensions
}
