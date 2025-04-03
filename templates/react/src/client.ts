import { createClient } from '@comity/islands/client';
import react from '@comity/react';
// @ts-ignore
import components from 'virtual:comity-islands';

const debug = false;

console.log('Comity Islands:', components);

createClient({
  debug,
  components,
  integrations: {
    react,
  },
});
