import type { FC } from 'hono/jsx';

type Modules = {
  default?: FC;
  [key: string]: FC;
};

declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<Modules>>;

  export = components;
}
