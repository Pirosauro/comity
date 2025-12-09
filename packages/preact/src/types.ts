import type { Context, ContextRenderer } from "hono";
import type { ComponentChildren, FunctionComponent, VNode } from "preact";
import type { RenderToPipeableStreamOptions } from "preact-render-to-string/stream-node";

export type PreactRendererOptions = {
  docType?: boolean | string;
};

export type PreactStreamRendererOptions = {
  renderer: (
    children: VNode,
    options?: RenderToPipeableStreamOptions
  ) => Promise<ReadableStream<Uint8Array>> | ReadableStream<Uint8Array>;
  docType?: boolean | string;
  headers?: Record<string, string>;
} & RenderToPipeableStreamOptions;

export type PreactModuleContext = {};

export type PreactModuleEvents = {};

export type PreactModuleHooks = {
  /**
   * Hook triggered after the Preact service has been initialized.
   */
  "@comity/preact:initialized": void;
};

export type PreactModuleOptions = {
  renderer: (
    ctx: Context,
    component: FunctionComponent,
    options?: PreactRendererOptions | PreactStreamRendererOptions
  ) => ContextRenderer;
  component: FunctionComponent;
} & (PreactRendererOptions | PreactStreamRendererOptions);

export type PropsWithChildren<P> = P & { children: ComponentChildren[] };
