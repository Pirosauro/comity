import type { IslandContract } from "@comity/hydration";
import type { PropsWithChildren } from "react";


export function Island<Data extends Record<string, unknown>>({
  children,
  ...props
}: PropsWithChildren<IslandContract<Data>>) {
  return (
    <comity-island>
      {children}
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(props),
        }}
      />
    </comity-island>
  );
}
