import type { ClientDirective } from '@comity/islands/types';
import { withHydration } from '../with-hydration.js';

export type AsyncComponentProps = ClientDirective & {
  $component: string;
  [k: string]: any;
};

/**
 * Experimental async component.
 */
export const AsyncComponent = async ({
  $component,
  ...props
}: AsyncComponentProps) => {
  try {
    if (!$component) {
      throw new Error(
        'The $component property is required but was not provided.'
      );
    }

    const [module, name = 'default'] = $component.split('#') as [
      string,
      string
    ];
    const components = (await import('virtual:comity-islands')) as any;
    const importer = components[`C_${module}`];
    const component = importer ? (await importer())?.[name] : undefined;

    if (!component) {
      throw new Error(
        `Ensure that the component "${$component}" exists and is exported correctly.`
      );
    }

    const HydratableComponent = withHydration(component, module);

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
