import type { JSX } from "preact";

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "comity-island": JSX.HTMLAttributes<HTMLElement>;
    }
  }
}
