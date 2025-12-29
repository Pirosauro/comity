import type { Env, Handler, Hono, MiddlewareHandler, Schema } from "hono";

export function createService<E extends Env, S extends Schema>(
  app: Hono<E, S, "/">
) {
  return {
    get: app.get.bind(app),
    post: app.post.bind(app),
    put: app.put.bind(app),
    delete: app.delete.bind(app),
    options: app.options.bind(app),
    patch: app.patch.bind(app),
    use: app.use.bind(app),
    on: app.on.bind(app),
    all: app.all.bind(app),
    route: app.route.bind(app),
    mount: app.mount.bind(app),
    fetch: app.fetch.bind(app),
    request: app.request.bind(app),
    notFound: app.notFound.bind(app),
    onError: app.onError.bind(app),
    lazy: async (
      method: string,
      path: string,
      loader: () => Promise<{ default: Handler | MiddlewareHandler }>
    ) => {
      app.on(method, path, async (c, next) => {
        const { default: handler } = await loader();

        return handler(c, next);
      });
    },
  };
}
