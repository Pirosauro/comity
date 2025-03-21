import { createClient } from '@comity/islands/client';
import hono from "@comity/islands";
const components = [null];
createClient(
false,
components,
[
hono,
]
);