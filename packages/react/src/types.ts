import type { Context, ContextRenderer } from "hono";
import type { FC, ReactNode } from "react";
import type {
  RenderToPipeableStreamOptions,
  RenderToReadableStreamOptions,
} from "react-dom/server";

export type ReactRendererOptions = {
  docType?: boolean | string;
};

export type ReactStreamRendererOptions = {
  renderer: (
    children: ReactNode,
    options?: RenderToReadableStreamOptions | RenderToPipeableStreamOptions
  ) => Promise<ReadableStream<any>>;
  docType?: boolean | string;
  headers?: Record<string, string>;
} & (RenderToReadableStreamOptions | RenderToPipeableStreamOptions);

export type ReactModuleContext = {};

export type ReactModuleEvents = {};

export type ReactModuleHooks = {
  /**
   * Hook triggered after the React service has been initialized.
   */
  "@comity/react:initialized": void;
};

export type ReactModuleOptions = {
  renderer: (
    ctx: Context,
    component: FC,
    options?: ReactRendererOptions | ReactStreamRendererOptions
  ) => ContextRenderer;
  component: FC;
} & (ReactRendererOptions | ReactStreamRendererOptions);

export type IslandOptions = {
  tag?: string;
};
