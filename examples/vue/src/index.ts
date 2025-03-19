import { Server } from '@comity/islands';
import { renderer } from './renderer.js';
import { routes } from 'virtual:comity-routes';

import { createSSRApp, FunctionalComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

console.log(routes);

const app = new Server();

// non-HTML output (API) should go here

// HTML rendered output
app.use(renderer);
app.registerRoutes(routes);

export default app;
