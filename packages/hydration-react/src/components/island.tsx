import type { IslandContract } from "@comity/hydration";
import type { PropsWithChildren } from "react";

import { JsonIslandSerializer } from "@comity/hydration";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "comity-island": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export function Island<Data extends Record<string, unknown>>({
  children,
  ...props
}: PropsWithChildren<IslandContract<Data>>) {
  return (
    <comity-island>
      {props.mode === "client-only" ? null : children}
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JsonIslandSerializer.serialize(props),
        }}
      />
    </comity-island>
  );
}
