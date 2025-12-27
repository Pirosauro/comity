import type { ApplicationOptions } from "./types.js";
import { Hono } from "hono";
import { createApplication } from "@comity/application";
import auth from "@comity/auth/setup";
import graphql from "@comity/graphql/setup";
import hydration from "@comity/hydration/setup";
import logger from "@comity/logger/setup";
import react from "@comity/react/setup";
import workspace from "@comity/workspace/setup";
import {
  createReactRendererMiddleware,
  renderToReadableStream,
} from "@comity/react/streaming";
import { Root } from "./components/root.js";

const app = new Hono();

(async () => {
  const modules = [auth, graphql, hydration, logger, react];
  const options: ApplicationOptions = {
    "@comity/application": {
      renderer: createReactRendererMiddleware(Root, {
        renderer: renderToReadableStream,
      }),
    },
    "@comity/auth": { secret: import.meta.env.VITE_JWT_SECRET! },
  };

  await createApplication(app, modules, options);
})();

export default app;
