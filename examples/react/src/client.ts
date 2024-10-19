import { createClient } from "@comity/islands/client";
import react from "@comity/react";
// import islands
import islands from "virtual:comity-islands";

const debug = false;

createClient({
  debug,
  islands,
  integrations: {
    react,
  },
});
