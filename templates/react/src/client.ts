import { createClient } from '@comity/islands/client';
import react from '@comity/react';
// @ts-ignore
import * as components from 'virtual:comity-islands';

const debug = false;

createClient({
  debug,
  components,
  integrations: {
    react,
  },
});
