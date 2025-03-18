import type { VNode, PropsWithChildren } from 'preact';

declare module 'hono' {
  interface DefaultRenderer {
    (children: Vnode, props?: any): Promise<Response>;
  }
}
