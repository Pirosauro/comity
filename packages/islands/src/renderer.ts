import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import type { FC, DOMAttributes } from 'hono/jsx';
import type { RenderToReadableStreamOptions } from 'hono/jsx/dom/server';
import { createContext, createElement, useContext } from 'hono/jsx';
import { stream } from 'hono/streaming';
import { hydrateRoot } from 'hono/jsx/dom/client';

export type Options = {
  docType?: boolean | string;
  stream?: {
    renderToStream: Function;
    options?: RenderToReadableStreamOptions;
    headers?: Record<string, string>;
  };
};

export type Props = {};

export type ComponentProps = Props & {
  ctx: Context;
  children: any;
};

const RequestContext = createContext<Context | null>(null);

/**
 * Create the renderer
 *
 * This function creates a renderer that renders a React component to a string
 * and returns it as an HTML response.
 *
 * @param {Context} ctx - The request context.
 * @param {FC<ComponentProps>} component - The React component to render.
 * @param {Options} [options] - Optional rendering options.
 * @return {(children: any, props?: Props) => Promise<Response>} - A function that takes children and props, and returns a Promise that resolves to an HTML response.
 */
const createRenderer =
  (ctx: Context, component?: FC<ComponentProps>, options?: Options) =>
  async (children: any, props?: Props) => {
    const node = component ? component({ children, ctx, ...props }) : children;
    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';

    // Stream rendering
    if (options?.stream) {
      return stream(ctx, async (stream) => {
        // Set headers
        if (typeof options.stream === 'object' && options.stream.headers) {
          Object.entries(options.stream.headers).forEach(([key, value]) => {
            ctx.header(key, value);
          });
        } else {
          ctx.header('Transfer-Encoding', 'chunked');
          ctx.header('Content-Type', 'text/html; charset=UTF-8');
        }

        // Write doctype
        if (docType) {
          await stream.write(docType);
        }

        // Render to stream
        await stream.pipe(
          await options.stream!.renderToStream(
            createElement(RequestContext.Provider, { value: ctx }, node),
            typeof options.stream === 'object' && options.stream.options
              ? options.stream.options
              : {}
          )
        );

        await stream.close();
      });
    }

    // String rendering
    const { renderToString } = await import('hono/jsx/dom/server');
    const body =
      docType +
      renderToString(
        createElement(RequestContext.Provider, { value: ctx }, node)
      );

    return ctx.html(body);
  };

/**
 * Hono JSX renderer middleware
 *
 * This middleware sets up the renderer for the Hono framework, allowing React components
 * to be rendered as part of the request handling process.
 *
 * @param {FC<ComponentProps>} component - The component to render.
 * @param {Options} options - The rendering options.
 * @return {MiddlewareHandler} - The middleware handler function.
 */
export const honoRenderer =
  (component?: FC<ComponentProps>, options?: Options): MiddlewareHandler =>
  (ctx, next) => {
    if (component) {
      ctx.setRenderer(createRenderer(ctx, component, options));
    }

    return next();
  };

/**
 * Request context
 *
 * This hook provides access to the request context within a React component.
 *
 * @return {Context<E>} - The request context.
 * @throws {Error} - If the RequestContext is not provided.
 */
export const useRequestContext = <E extends Env = any>(): Context<E> => {
  const ctx = useContext(RequestContext);

  if (!ctx) {
    throw new Error('RequestContext is not provided.');
  }

  return ctx;
};

/**
 * Component renderer
 *
 * This function renders a React component into a specified HTML element on the client side.
 *
 * @param {FC} component - The component to render.
 * @param {Attributes} props - The component's props.
 * @param {HTMLElement} element - The parent HTMLElement.
 * @return {Promise<void>} - A promise that resolves when the component is hydrated.
 */
const hono = async (
  component: FC,
  props: DOMAttributes,
  element: HTMLElement
) => {
  const target = await createElement(component, props);

  await hydrateRoot(element, target);
};

export default hono;
