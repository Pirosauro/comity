import type { JSX as HonoJSX } from 'hono/jsx';

declare module 'hono/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'comity-island': HonoJSX.HTMLAttributes;
    }
  }
}
