import type {
  ClientDirective,
  HydratableComponent,
  HydrationData,
  Strategy,
} from '../types/index.d.js';

/**
 * Look for hydration strategy directive on props
 *
 * @param {(P & ClientDirective)} props - The component props
 * @return {(Strategy & undefined)}
 */
function getStrategy<P>(props: P & ClientDirective): Strategy | undefined {
  if (props['client:load']) {
    return { type: 'load' };
  }
  if (props['client:visible']) {
    return { type: 'visible' };
  }
  if (props['client:media']) {
    return {
      type: 'media',
      value: props['client:media'],
    };
  }
  if (props['client:idle']) {
    return { type: 'idle' };
  }
}

/**
 * Remove hydration strategy directive from props
 *
 * @param {(P & ClientDirective)} props - The component props
 * @return {P}
 */
function getProps<P>(props: P & ClientDirective): P {
  const directives: (keyof ClientDirective)[] = [
    'client:load',
    'client:visible',
    'client:media',
    'client:idle',
    'client:none',
  ];
  const result = { ...props };

  // remove client:* props
  directives.forEach((d) => delete result[d]);

  return result;
}

/**
 * Retrieve hydration data
 *
 * @param {HydratableComponent<P>} component - The component
 * @param {(P & ClientDirective)} props - The component props
 * @return {(HydrationData)}
 */
export function getHydrationData<P>(
  component: HydratableComponent<P>,
  props: P & ClientDirective
): HydrationData {
  const strategy = getStrategy<P>(props);
  const framework = component.framework || 'hono';

  return {
    name: component.name || 'Unknown',
    strategy,
    props: getProps<P>(props),
    framework,
  };
}
