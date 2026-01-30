import type { HttpResponse } from "@comity/http";

import { HonoHttpAdapter } from "@comity/http/adapters/hono";
import { Kernel } from "@comity/kernel";
import { DiContainer } from "@comity/primitives/di";
import { EventBus, HookBus } from "@comity/primitives/lifecycle";
import { Hono } from "hono";
// import { renderHtml } from "./renderers/react-static.js";
import { presentError } from "./presenters/error.js";
import { presentHello } from "./presenters/hello.js";
import { htmlRenderer } from "./renderers/html.js";
import { helloUseCase } from "./use-cases/hello.js";

const app = new Hono<{ Variables: { "http:result": HttpResponse } }>();
const services = new DiContainer();
const events = new EventBus();
const hooks = new HookBus();
const kernel = new Kernel({
  events,
  hooks,
  services,
});
const adapter = new HonoHttpAdapter();

(async () => {
  app.get("/", async (c, next) => {
    const result = helloUseCase();

    const contract = result.success ? presentHello(result) : presentError(result.error);

    const response = await htmlRenderer.render(contract);

    return adapter.send(response, c);
  });

  app.get("/api/hello", (c) => {
    const result = helloUseCase();

    if (!result.success) {
      return c.json({ error: result.error.code }, 500);
    }

    return c.json(result.value);
  });
})();

export default app;
