import { createClient } from '@comity/islands/client';
import preact from '@comity/preact';
// @ts-ignore
import components from 'virtual:comity-islands';

const debug = false;

createClient({
  debug,
  components,
  integrations: {
    preact,
  },
});
