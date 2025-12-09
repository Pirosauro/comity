import type { MiddlewareHandler } from "hono";
import type { FunctionComponent, VNode } from "preact";
import type { PreactRendererOptions, PropsWithChildren } from "./types.js";
import { renderToString } from "preact-render-to-string";

export const preactRendererMiddleware =
  (
    component: FunctionComponent,
    options?: PreactRendererOptions
  ): MiddlewareHandler =>
  (ctx, next) => {
    function renderer(children: VNode, props?: PropsWithChildren<any>) {
      const node = component ? component({ ...props, children }) : children;
      const docType =
        typeof options?.docType === "string"
          ? options.docType
          : options?.docType === true
          ? "<!DOCTYPE html>"
          : "";

      return ctx.html(docType + renderToString(node as VNode));
    }

    ctx.setRenderer(renderer as any);

    return next();
  };
