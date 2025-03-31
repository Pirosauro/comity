import type { FC } from 'hono/jsx';

declare module 'virtual:comity-islands' {
  const components: Record<string, FC>;

  export = components;
}
