import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import type { FC, ReactElement, Attributes } from 'react';
import { stream } from 'hono/streaming';
import type {
  RenderToReadableStreamOptions,
  RenderToPipeableStreamOptions,
} from 'react-dom/server';
import { createContext, createElement, useContext } from 'react';
import { hydrateRoot } from 'react-dom/client';

export type Options = {
  docType?: boolean | string;
  stream?:
    | boolean
    | {
        options?: RenderToReadableStreamOptions | RenderToPipeableStreamOptions;
        headers?: Record<string, string>;
      };
};

export type Props = {};

export type ComponentProps = Props & {
  ctx: Context;
  children: ReactElement;
};

const RequestContext = createContext<Context | null>(null);

/**
 * Create the renderer
 *
 * @param {Context} ctx
 * @param {FC<ComponentProps>} [component]
 * @param {Options} [options]
 * @return {(children: ReactElement, props?: Props) => Promise<Response>}
 */
const createRenderer =
  (ctx: Context, component?: FC<ComponentProps>, options?: Options) =>
  async (children: ReactElement, props?: Props) => {
    const node = component ? component({ children, ctx, ...props }) : children;
    const isNode =
      typeof process !== 'undefined' &&
      process.versions != null &&
      process.versions.node != null;
    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';

    // Stream rendering
    if (options?.stream) {
      const { renderToReadableStream, renderToPipeableStream } = await import(
        'react-dom/server'
      );

      // Check if streaming is supported
      if (
        options?.stream &&
        !renderToReadableStream &&
        !renderToPipeableStream
      ) {
        throw new Error(
          'React streaming is not supported in this environment. Please use a compatible environment.'
        );
      }

      // @ts-ignore
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
        if (!isNode && typeof renderToReadableStream === 'function') {
          await stream.pipe(
            await renderToReadableStream(
              createElement(RequestContext.Provider, { value: ctx }, node)
            )
          );
        } else if (isNode && typeof renderToPipeableStream === 'function') {
          const { PassThrough } = await import('stream');
          const pt = new PassThrough({ highWaterMark: 16384 }); // Limit buffer size

          // Pipe to PassThrough stream when shell is ready
          const { pipe } = renderToPipeableStream(
            createElement(RequestContext.Provider, { value: ctx }, node),
            {
              onShellReady() {
                pipe(pt); // Pipe to PassThrough stream when shell is ready
              },
              onError(error) {
                throw error;
              },
            }
          );

          // Pipe to response stream
          await stream.pipe(
            new ReadableStream({
              start(controller) {
                pt.on('data', (chunk) => controller.enqueue(chunk));
                pt.on('end', () => controller.close());
                pt.on('error', (err) => controller.error(err));
              },
            })
          );
        }

        await stream.close();
      });
    }

    // String rendering
    const { renderToString } = await import('react-dom/server');
    const body =
      docType +
      renderToString(
        createElement(RequestContext.Provider, { value: ctx }, node)
      );

    return ctx.html(body);
  };

/**
 * React renderer middleware
 *
 * @param {FC<ComponentProps>} component - The component to render
 * @param {Options} options - The rendering options
 * @return {MiddlewareHandler}
 */
export const reactRenderer =
  (component?: FC<ComponentProps>, options?: Options): MiddlewareHandler =>
  (ctx, next) => {
    ctx.setRenderer(createRenderer(ctx, component, options));

    return next();
  };

/**
 * Request context
 *
 * @return {Context<E>}
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
 * @param {FC} component - The component to render
 * @param {Attributes} props - The component's props
 * @param {HTMLElement} element - The parent HTMLElement
 */
const react = async (
  component: FC,
  props: Attributes,
  element: HTMLElement
) => {
  const target = await createElement(component, props);

  await hydrateRoot(element, target);
};

export default react;
