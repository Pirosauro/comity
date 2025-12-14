import type { MiddlewareHandler } from "hono";
import type { FC, PropsWithChildren, ReactNode } from "react";
import type { ReactStreamRendererOptions } from "../types.js";
import { stream } from "hono/streaming";

export const createReactRendererMiddleware = (
  component: FC,
  options: ReactStreamRendererOptions
): MiddlewareHandler => {
  return async (ctx, next) => {
    async function renderer(children: ReactNode, props?: PropsWithChildren) {
      const node = component ? component({ ...props, children }) : children;
      const docType =
        typeof options?.docType === "string"
          ? options.docType
          : options?.docType === true
          ? "<!DOCTYPE html>"
          : "";

      return stream(ctx, async (stream) => {
        // Merge default and custom headers
        const headers: Record<string, string> = {
          "Transfer-Encoding": "chunked",
          "Content-Type": "text/html; charset=UTF-8",
          ...(options.headers || {}),
        };
        Object.entries(headers).forEach(([key, value]) => {
          ctx.header(key, value);
        });

        // Write doctype
        if (docType) {
          await stream.write(docType);
        }

        // Render to stream with error handling
        try {
          const rendered = await options?.renderer(node, options);

          await stream.pipe(rendered);
        } catch (err) {
          ctx.status(500);
          stream.abort();
        }

        await stream.close();
      });
    }

    // Set asynchronous stream renderer
    ctx.setRenderer(renderer as any);

    await next();
  };
};
