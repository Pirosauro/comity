import { createClient } from '@comity/islands/client';
import hono from '@comity/islands';
import { components } from 'virtual:comity-islands';

const debug = false;

console.log(components);

createClient({
  debug,
  components,
  integrations: {
    hono,
  },
});
