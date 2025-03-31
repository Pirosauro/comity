import type { FC } from 'react';
import type { ClientDirective } from '@comity/islands/types';
import { withHydration } from '../with-hydration.js';
// @ts-ignore
import * as components from 'virtual:comity-islands';

export type IslandProps = ClientDirective & {
  $component: string;
  [k: string]: any;
};

/**
 * Experimental Island component.
 */
export const Island: FC<IslandProps> = ({ $component, ...props }) => {
  try {
    if (!$component) {
      throw new Error(
        'The $component property is required but was not provided.'
      );
    }

    const name = 'C_' + $component;
    const HydratableComponent = components[name]
      ? withHydration(components[name], $component)
      : undefined;
    console.log(components);
    if (!HydratableComponent) {
      throw new Error(
        `Ensure that the component "${$component}" exists and is exported correctly.`
      );
    }

    return <HydratableComponent {...props} />;
  } catch (error) {
    if (error instanceof Promise) {
      error.then((e) =>
        console.error('Error loading component:', (e as Error).message || e)
      );
    } else {
      console.error(
        'Error loading component:',
        (error as Error).message || error
      );
    }
  }

  return <></>;
};
