import { createClient } from '@comity/islands/client';
import hono from '@comity/islands';
// import islands
import islands from 'virtual:comity-islands';

const debug = false;

createClient({
  debug,
  islands,
  integrations: {
    hono,
  },
});
