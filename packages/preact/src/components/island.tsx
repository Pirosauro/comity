import type { FunctionalComponent as FC } from 'preact';
import type { ClientDirective } from '@comity/islands/types';
import { lazy } from 'preact/compat';
import { withHydration } from '../with-hydration.js';

export type IslandProps = ClientDirective & {
  $component: string;
  [k: string]: any;
};

const loadComponent = async ($component: string) => {
  const [module, name = 'default'] = $component.split('#') as [string, string];
  // @ts-ignore
  const components = (await import('virtual:comity-islands')) as any;
  const importer = components[`C_${module}`];
  const component = importer ? (await importer())?.[name] : undefined;

  if (!component) {
    throw new Error(
      `Ensure that the component "${$component}" exists and is exported correctly.`
    );
  }

  return { default: withHydration(component, module) };
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

    const HydratableComponent = lazy(() => loadComponent($component));

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
