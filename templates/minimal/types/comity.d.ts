import type { Handler } from 'hono';
import type { FC } from 'hono/jsx';

declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<{ default: FC }>>;
  const filename: string | undefined;

  export { components, filename };
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export { routes };
}
