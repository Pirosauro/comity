import type { FC } from 'hono/jsx';
import type { ClientDirective } from './../types/index.d.js';
import { getHydrationData } from './get-hydration-data.js';

/**
 * Wrap the component into an island
 *
 * @param {(FC<P>)} Component - The component to wrap
 * @return {FC<P>}
 */
export function withHydration<P>(
  Component: FC<P>
): (props: P & ClientDirective) => any {
  const island = (props: P & ClientDirective) => {
    const data = getHydrationData(Component, props);

    // not hydratable, render static
    if (!data.strategy) {
      return <Component {...data.props} />;
    }

    // render
    return (
      <comity-island style={{ display: 'contents' }}>
        <Component {...data.props} />
        <script
          type="application/json"
          data-island
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      </comity-island>
    );
  };

  return island;
}
