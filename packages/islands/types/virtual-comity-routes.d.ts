import type { Handler } from 'hono';

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export { routes };
}
