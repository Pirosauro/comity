import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import type { FunctionComponent, VNode, Attributes } from 'preact';
import type { RenderToPipeableStreamOptions } from 'preact-render-to-string/stream-node';
import { createContext, h, hydrate } from 'preact';
import { useContext } from 'preact/hooks';
import { renderToString, renderToStringAsync } from 'preact-render-to-string';

export type Options = {
  docType?: boolean | string;
  stream?:
    | boolean
    | {
        options?: RenderToPipeableStreamOptions;
        headers?: Record<string, string>;
      };
};

export type Props = {};

export type ComponentProps = Props & {
  ctx: Context;
  children: VNode;
};

const RequestContext = createContext<Context | null>(null);

/**
 * Create the renderer
 *
 * @param {Context} ctx - The request context.
 * @param {FunctionComponent<ComponentProps>} [component] - The Preact component to render.
 * @param {Options} [options] - Optional rendering options.
 * @return {(children: VNode, props?: Props) => Promise<Response>}
 */
const createRenderer =
  (
    ctx: Context,
    component?: FunctionComponent<ComponentProps>,
    options?: Options
  ) =>
  async (children: VNode, props?: Props) => {
    const node = component
      ? h(component, { ...props, ctx, children }, children)
      : children;
    // const isNode =
    //   typeof process !== 'undefined' &&
    //   process.versions != null &&
    //   process.versions.node != null;
    // const { renderToReadableStream } = !isNode
    //   ? await import('preact-render-to-string/stream')
    //   : {};
    // const { renderToPipeableStream } = isNode
    //   ? await import('preact-render-to-string/stream-node')
    //   : {};

    // if (options?.stream && !renderToReadableStream && !renderToPipeableStream) {
    //   throw new Error(
    //     'React streaming is not supported in this environment. Please use a compatible environment.'
    //   );
    // }

    // if (options?.stream) {
    //   if (typeof renderToReadableStream === 'function') {
    //     console.log('ReadableStream');
    //     const stream = renderToReadableStream(
    //       h(RequestContext.Provider, { value: ctx }, node)
    //     );

    //     if (typeof options.stream === 'object' && options.stream.headers) {
    //       Object.entries(options.stream.headers).forEach(([key, value]) => {
    //         ctx.header(key, value);
    //       });
    //     } else {
    //       ctx.header('Transfer-Encoding', 'chunked');
    //       ctx.header('Content-Type', 'text/html; charset=UTF-8');
    //     }

    //     return ctx.body(stream);
    //   }

    //   const { PassThrough, Readable } = await import('stream');
    //   const stream = new PassThrough();

    //   console.log('PipeableStream');
    //   const { pipe } = renderToPipeableStream!(
    //     h(RequestContext.Provider, { value: ctx }, node),
    //     {
    //       onShellReady() {
    //         ctx.header('Content-Type', 'text/html; charset=UTF-8');
    //         pipe(stream); // Pipe to PassThrough stream when shell is ready
    //       },
    //       onAllReady() {
    //         console.log('Stream finished rendering all content.');
    //       },
    //       onError(err) {
    //         console.error('Error during streaming:', err);
    //       },
    //     }
    //   );

    //   return ctx.body(
    //     new ReadableStream({
    //       start(controller) {
    //         stream.on('data', (chunk) => controller.enqueue(chunk));
    //         stream.on('end', () => controller.close());
    //         stream.on('error', (err) => controller.error(err));
    //       },
    //     })
    //   );
    // }

    // console.log('String');

    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';
    const body =
      docType +
      (await renderToStringAsync(
        h(RequestContext.Provider, { value: ctx }, node)
      ));

    return ctx.html(body);
  };

/**
 * Preact renderer middleware
 *
 * @param {FunctionComponent<ComponentProps>} component - The component to render.
 * @param {Options} options - The rendering options.
 * @return {MiddlewareHandler}
 */
export const preactRenderer =
  (
    component?: FunctionComponent<ComponentProps>,
    options?: Options
  ): MiddlewareHandler =>
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
 * @param {FunctionComponent} component - The component to render.
 * @param {Attributes} props - The component's props.
 * @param {HTMLElement} element - The parent HTMLElement.
 */
const preact = async (
  component: FunctionComponent,
  props: Attributes,
  element: HTMLElement
) => {
  const target = h(component, props);

  hydrate(target, element);
};

export default preact;
