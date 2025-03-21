import { createClient } from '@comity/islands/client';
import hono from '@comity/islands';

const debug = false;

createClient({
  debug,
  integrations: {
    hono,
  },
});
