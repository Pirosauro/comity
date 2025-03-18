import type { JSX as PreactJSX } from 'preact';

declare module 'preact/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'comity-island': PreactJSX.HTMLAttributes<CustomElement>;
    }
  }
}
