import type { Handler } from 'hono';

declare module 'hono' {
  interface DefaultRenderer {
    (children: ReactElement, props?: Props): Promise<Response>;
  }
}
