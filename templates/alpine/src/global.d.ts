import type { Handler } from 'hono';
import type { Alpine as AlpineType } from 'alpinejs';

declare module 'hono' {
  interface DefaultRenderer {
    (children: ReactElement, props?: Props): Promise<Response>;
  }
}

declare global {
  var Alpine: AlpineType;
}
