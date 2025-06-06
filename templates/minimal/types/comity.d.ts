import type { Handler } from 'hono';
import type { FC } from 'hono/jsx';

declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<Record<string, FC>>>;

  export = components;
}
declare module 'virtual:comity-islands?client' {
  const components: Record<string, () => Promise<Record<string, FC>>>;

  export = components;
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export { routes };
}
