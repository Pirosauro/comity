import type { Env, Schema } from "hono";
import type {
  H,
  NotFoundHandler,
  ErrorHandler,
  BlankEnv,
  BlankSchema,
} from "hono/types";
import { Hono } from "hono";

const validMethods = ["get", "post", "put", "delete"];

export class Server<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema,
  BasePath extends string = "/"
> extends Hono<E, S, BasePath> {
  registerRoutes(routes: Record<string, H | ErrorHandler>) {
    let count = 0;

    console.log("\u001B[34mRegistering routes\u001B[0m");

    Object.entries(routes).forEach(([route, handler]) => {
      let [path, method = "get"] = route.split(".");

      // custom 404 page
      if (path === "/_404") {
        this.notFound(handler as NotFoundHandler);
        console.log("404");

        return ++count;
      }

      // error handling
      if (path === "/_500") {
        this.onError(handler as ErrorHandler);
        console.log("500");

        return ++count;
      }

      // ignore files starting with underscore or invalid
      // if (file.startsWith('_') || !method || !handler) continue

      // normalize method and allow file with extensions on path
      if (!validMethods.includes(method)) {
        method = "get";
      }

      this.on(method, path, handler as H);
      console.log(method.toUpperCase(), path);

      count++;
    });

    console.log("\u001B[33m[OK] " + count + " routes registered\u001B[0m");
  }
}
