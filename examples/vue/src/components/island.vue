<script>
import { defineComponent } from 'vue';
import { getComponent } from 'virtual:comity-islands';

defineComponent({
  name: 'ComityIsland',
  props: {
    '$client:load': {
      type: Boolean,
      default: undefined,
      validator: (v, d) => v && Object.keys(d).length === 1,
    },
    '$client:idle': {
      type: Boolean,
      default: undefined,
      validator: (v, d) => v && Object.keys(d).length === 1,
    },
    '$client:media': {
      type: String,
      default: undefined,
      validator: (v, d) => v && Object.keys(d).length === 1,
    },
    '$client:none': {
      type: Boolean,
      default: undefined,
      validator: (v, d) => v && Object.keys(d).length === 1,
    },
    '$client:visible': {
      type: Boolean,
      default: undefined,
      validator: (v, d) => v && Object.keys(d).length === 1,
    },
  },
  render: () =>
    h('comity-island', { style: { display: 'contents' } }, [
      h(component, { ...data.props }),
      h('script', {
        type: 'application/json',
        'data-island': true,
        innerHTML: JSON.stringify(data),
      }),
    ]),
});
</script>

<template>
  <comity-island>
    <slot />
  </comity-island>
</template>
