import { defineComponent, onMounted, ref } from 'vue';
import { withHydration } from '@comity/vue';
import { filename } from 'virtual:comity-islands';
import Template from './badge.vue';

export const Badge = defineComponent({
  name: 'Badge',
  props: {
    server: String,
    client: String,
  },
  setup(props) {
    const env = ref(props.server || 'server');

    onMounted(() => {
      if (typeof window !== 'undefined') {
        env.value = props.client || 'client';
      }
    });

    return { env };
  },
  render() {
    return <Template env={this.env} />;
  },
});

export const BadgeIsland = withHydration(Badge, filename);

export default BadgeIsland;
