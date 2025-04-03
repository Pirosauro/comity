import type { FC } from 'hono/jsx';
import type { ClientDirective } from '../types/module.js';
import { getHydrationData } from './get-hydration-data.js';

/**
 * Enhance a component with hydration capabilities.
 *
 * This function wraps a given component and adds properties to it,
 * enabling it to be hydrated on the client side. It also attaches
 * metadata to the component for hydration purposes.
 *
 * @param {FC<P> & { filename?: string; framework?: string }} Component - The component to wrap.
 * @param {string} filename - The component filename.
 * @return {FC<P & ClientDirective>} - The enhanced component with hydration capabilities.
 */
export function withHydration<P = Record<string, any>>(
  Component: FC<P> & { filename?: string; framework?: string },
  filename: string
): FC<P & ClientDirective> {
  // Create the island component
  const island: FC<P & ClientDirective> = (props) => {
    const data = getHydrationData(props, 'hono', filename);

    // If the component is not hydratable, render it statically
    if (!data.strategy) {
      return <Component {...data.props} />;
    }

    // Render the component with hydration data
    return (
      <>
        <comity-island
          style={{ display: 'contents' }}
          data-island={JSON.stringify(data)}>
          <Component {...data.props} />
        </comity-island>
      </>
    );
  };

  return island;
}
