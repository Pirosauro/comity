/// <reference types="vite/client" />
import type { Handler } from 'hono';
import type { FC } from 'hono/jsx';

declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<Record<string, FC>>>;

  export = components;
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export { routes };
}

declare module '*?hash' {
  const hash: string;

  export default hash;
}
