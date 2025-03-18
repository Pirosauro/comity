import type { Vnode } from 'preact';

declare module 'hono' {
  interface ContextRenderer {
    (children: VNode, props?: any): Promise<Response>;
  }
}
