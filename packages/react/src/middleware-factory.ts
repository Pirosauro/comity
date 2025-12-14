import type { MiddlewareHandler } from "hono";
import type { FC, PropsWithChildren, ReactNode } from "react";
import type { ReactRendererOptions } from "./types.js";
import { renderToString } from "react-dom/server";

export const createReactRendererMiddleware =
  (root: FC, options?: ReactRendererOptions): MiddlewareHandler =>
  (ctx, next) => {
    function renderer(children: ReactNode, props?: PropsWithChildren) {
      const node = root ? root({ ...props, children }) : children;
      const docType =
        typeof options?.docType === "string"
          ? options.docType
          : options?.docType === true
          ? "<!DOCTYPE html>"
          : "";

      return ctx.html(docType + renderToString(node));
    }

    ctx.setRenderer(renderer as any);

    return next();
  };
