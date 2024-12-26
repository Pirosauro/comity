import type { Handler } from 'hono';
import type {} from 'react';
import type {} from '@comity/react';

declare module 'hono' {
  interface DefaultRenderer {
    (children: ReactElement, props?: Props): Promise<Response>;
  }
}

declare module '@comity/react' {
  interface Props {
    title: string;
  }
}

declare module 'virtual:comity-routes' {
  const routes: Record<string, Handler>;

  export default routes;
}
