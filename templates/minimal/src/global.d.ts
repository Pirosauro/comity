import type { Handler } from 'hono';

declare module 'hono' {
  interface DefaultRenderer {
    (children: ReactElement, props?: Props): Promise<Response>;
  }
}

declare module '@comity/islands' {
  interface Props {
    title: string;
  }
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export default routes;
}
