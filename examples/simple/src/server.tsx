import { httpHonoAdapter } from "@comity/http-hono";
import http from "@comity/http/setup";
import { Kernel } from "@comity/kernel";
import { loadModules } from "@comity/kernel/modules";
import { DiContainer } from "@comity/primitives/di";
import { EventBus, HookBus } from "@comity/primitives/lifecycle";
import { Hono } from "hono";
import { presentHello } from "./presenters/hello.js";
import { renderHtml } from "./renderers/html.js";
import { helloUseCase } from "./use-cases/hello.js";
import { HelloView } from "./views/hello.js";

const app = new Hono();

/* ───────────────── Kernel setup ───────────────── */

const kernel = new Kernel({
  services: new DiContainer(),
  events: new EventBus(),
  hooks: new HookBus(),
});

/* ───────────────── Module loading ───────────────── */

/* ───────────────── HTTP runtime ───────────────── */

const adapter = httpHonoAdapter(app);
const modules = [http];

await loadModules(kernel, modules, {
  http: {
    adapter,
  },
});

/* ───────────────── Routes (app-level) ───────────────── */

app.get("/", async (c) => {
  const result = helloUseCase();

  if (result.success) {
    const contract = presentHello(result);
    const response = await renderHtml(<HelloView {...contract.data} />, {
      status: 200,
    });

    if (response.ok) {
      const headers = new Headers(response.value.headers);

      // Content-Type se non presente
      if (!headers.has("content-type")) {
        headers.set("content-type", "text/html; charset=utf-8");
      }

      return new Response(response.value.stream, {
        status: response.value.status,
        headers,
      });
    }
  }

  // const contract = result.success ? presentHello(result) : presentError(result.error);
  // const response = await renderHtml(<HelloView {...contract.value} />, {
  //   status: response.ok ? 200 : 500,
  // });

  return c.text("Internal Server Error", 500);
});

// app.get("/api/hello", (c) => {
//   const result = helloUseCase();

//   if (!result.success) {
//     return c.json({ error: result.error.code }, 500);
//   }

//   return c.json(result.value);
// });

export default app;
