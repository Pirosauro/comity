import type { Handler } from 'hono';
import type { FunctionalComponent as FC } from 'preact';

declare module 'virtual:comity-islands' {
  const components: Record<string, () => Promise<{ default: FC }>>;
  const filename: string | undefined;

  export { components, filename };
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export { routes };
}

declare module '@comity/preact' {
  interface Props {
    title: string;
  }
}
