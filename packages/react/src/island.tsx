import type { ComponentType } from "react";
import type { ClientDirective } from "@comity/hydration";
import { getHydrationData } from "@comity/hydration";

/**
 * Wrap the component into an island
 */
export function defineIsland<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  hash: string
) {
  const Island = (props: P & ClientDirective) => {
    const data = getHydrationData(props, "react", hash);

    // not hydratable, render static
    if (!data.strategy) {
      return <Component {...data.props} />;
    }

    // render
    return (
      <comity-island style={{ display: "contents" }}>
        <Component {...data.props} />
        <script
          type="application/json"
          data-island
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      </comity-island>
    );
  };

  return Island;
}
