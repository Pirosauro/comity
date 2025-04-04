import { createClient } from '@comity/islands/client';
import preact from '@comity/preact';

const debug = false;

createClient({
  debug,
  integrations: {
    preact,
  },
});
