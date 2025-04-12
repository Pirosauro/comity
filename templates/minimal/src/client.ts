import { createClient } from '@comity/islands/client';
import hono from '@comity/islands';
// @ts-ignore
import components from 'virtual:comity-islands';

const debug = false;

createClient({
  debug,
  components,
  integrations: {
    hono,
  },
});
