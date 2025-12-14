import { createClient } from "@comity/hydration/client";
import { render } from "@comity/react";
import components from "./islands.js";
//
import "./style.css";

const debug = false;

createClient({
  debug,
  components,
  integrations: {
    react: render,
  },
});
