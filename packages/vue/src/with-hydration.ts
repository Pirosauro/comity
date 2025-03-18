import type { Component, FunctionalComponent } from 'vue';
import type { ClientDirective } from '@comity/islands/types';
import { h } from 'vue';
import { getHydrationData } from '@comity/islands';

/**
 * Wrap the component into an island
 *
 * @param {Component} Component - The component to wrap
 * @return {FunctionalComponent<P & ClientDirective>}
 */
export function withHydration<P>(
  component: Component<P>,
  filename: string
): FunctionalComponent<P & ClientDirective> {
  const island: FunctionalComponent<P & ClientDirective> = (props) => {
    const data = getHydrationData(props, 'vue', filename);

    // not hydratable, render static
    if (!data.strategy) {
      return h(component, { ...data.props });
    }

    // render
    return h('comity-island', { style: { display: 'contents' } }, [
      h(component, { ...data.props }),
      h('script', {
        type: 'application/json',
        'data-island': true,
        innerHTML: JSON.stringify(data),
      }),
    ]);
  };

  return island;
}
