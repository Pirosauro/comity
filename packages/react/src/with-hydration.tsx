import type { FC } from 'react';
import type { ClientDirective } from '@comity/islands/types';
import { getHydrationData } from '@comity/islands';

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
  // Add filename property to the component
  if (!Component.filename) {
    Object.defineProperty(Component, 'filename', {
      value: filename,
      writable: false,
    });
  }

  // Add framework property to the component
  if (!Component.framework) {
    Object.defineProperty(Component, 'framework', {
      value: 'hono',
      writable: false,
    });
  }

  // Create the island component
  const island: FC<P & ClientDirective> = (props) => {
    const data = getHydrationData(props, 'react', filename);
    console.log('DATA', data);
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

  // Add name to the island component
  Object.defineProperty(island, 'name', {
    value: `${Component.displayName || Component.name}Island`,
    writable: true,
  });

  return island;
}
