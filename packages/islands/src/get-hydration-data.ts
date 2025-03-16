import type {
  ClientDirective,
  HydrationData,
  Strategy,
} from '../types/module.js';

type Props<P = Record<string, any>> = P & ClientDirective;

/**
 * Look for hydration strategy directive on props.
 *
 * This function checks the component props for hydration strategy directives
 * and returns the corresponding strategy object.
 *
 * @param {Props<P>} props - The component props.
 * @return {(Strategy | undefined)} - The hydration strategy or undefined if no strategy is found.
 */
function getStrategy<P>(props: Props<P>): Strategy | undefined {
  if (props['$client:load']) {
    return { type: 'load' };
  }
  if (props['$client:visible']) {
    return { type: 'visible' };
  }
  if (props['$client:media']) {
    return {
      type: 'media',
      value: props['$client:media'],
    };
  }
  if (props['$client:idle']) {
    return { type: 'idle' };
  }
}

/**
 * Remove hydration strategy directive from props.
 *
 * This function creates a copy of the component props and removes any
 * hydration strategy directives from it.
 *
 * @param {Props<P>} props - The component props.
 * @return {P} - The component props without hydration strategy directives.
 */
function getProps<P>(props: Props<P>): P {
  const result = { ...props };

  delete result['$client:load'];
  delete result['$client:visible'];
  delete result['$client:media'];
  delete result['$client:idle'];
  delete result['$client:none'];

  return result as P;
}

/**
 * Retrieve hydration data.
 *
 * This function extracts hydration data from the component props, including
 * the hydration strategy, component hash, and framework name.
 *
 * @param {(P & ClientDirective & Props)} props - The component props.
 * @param {string} framework - The framework name.
 * @param {string} component - The component hash.
 * @return {HydrationData} - The hydration data.
 */
export function getHydrationData<P>(
  props: P & ClientDirective & Props,
  framework: string,
  component: string
): HydrationData {
  const strategy = getStrategy<P>(props);

  return {
    strategy,
    component,
    props: getProps<P>(props),
    framework,
  };
}
