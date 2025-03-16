import type { JSX as Hono } from 'hono/jsx';

declare module 'hono/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'comity-island': Hono.HTMLAttributes;
    }
  }
}
