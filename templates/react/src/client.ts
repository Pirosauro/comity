import { createClient } from '@comity/islands/client';
import react from '@comity/react';

const debug = false;

createClient({
  debug,
  integrations: {
    react,
  },
});
