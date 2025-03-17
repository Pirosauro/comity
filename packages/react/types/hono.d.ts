import type { ReactElement } from 'react';

declare module 'hono' {
  interface ContextRenderer {
    (children: ReactElement, props?: any): Promise<Response>;
  }
}
