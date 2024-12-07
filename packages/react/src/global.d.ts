import type {} from 'hono';
import type {} from 'react';

declare module 'hono' {
  interface ContextRenderer {
    (children: ReactElement, props?: Props): Promise<Response>;
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'comity-island': JSX.HTMLAttributes<CustomElement>;
    }
  }
}
