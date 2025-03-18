import type { ReactElement, PropsWithChildren } from 'react';

declare module 'hono' {
  interface DefaultRenderer {
    (children: ReactElement, props?: PropsWithChildren): Promise<Response>;
  }
}
