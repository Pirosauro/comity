import type { Component, FunctionalComponent } from 'vue';
import type { ClientDirective } from '@comity/islands/types';
import { h, computed, useAttrs } from 'vue';
import { getHydrationData } from '@comity/islands';

/**
 * Wrap the component into an island
 *
 * @param {Component} Component - The component to wrap
 * @return {FunctionalComponent<P & ClientDirective>}
 */
const ParentComponent: FunctionalComponent<ClientDirective> = (
  props,
  { slots }
) => {
  const attrs = useAttrs();

  // List of props to exclude
  const excludedProps = ['excludeMe', 'anotherProp'];

  // Filter the attributes
  const filteredAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !excludedProps.includes(key))
    )
  );

  return h('div', {}, [
    h('h2', 'Parent Component'),
    h('ChildComponent', { ...filteredAttrs.value }), // Pass only filtered props
    slots.default?.(),
  ]);
};
