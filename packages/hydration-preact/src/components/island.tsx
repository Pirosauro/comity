import type { IslandContract } from "@comity/hydration";
import type { ComponentChildren } from "preact";

import { JsonIslandSerializer } from "@comity/hydration";

type IslandProps<Data extends Record<string, unknown>> = IslandContract<Data> & {
  children?: ComponentChildren;
};

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "comity-island": JSX.HTMLAttributes<HTMLElement>;
    }
  }
}

export function Island<Data extends Record<string, unknown>>({
  children,
  ...props
}: IslandProps<Data>) {
  return (
    <comity-island>
      <div data-comity-root>{props.mode === "client-only" ? null : children}</div>
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JsonIslandSerializer.serialize(props),
        }}
      />
    </comity-island>
  );
}
