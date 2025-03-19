import { createClient } from '@comity/islands/client';
import vue from '@comity/vue';
import { components } from 'virtual:comity-islands';

const debug = false;

console.log(components);

createClient({
  debug,
  components,
  integrations: {
    vue,
  },
});
