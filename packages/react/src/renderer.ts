import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import type { FC, ReactElement, Attributes } from 'react';
import type { RenderToReadableStreamOptions } from 'react-dom/server';
import { createContext, createElement, useContext } from 'react';
import { hydrateRoot } from 'react-dom/client';

export type Options = {
  docType?: boolean | string;
  stream?:
    | boolean
    | {
        options?: RenderToReadableStreamOptions;
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
    const { renderToReadableStream, renderToString } = await import(
      'react-dom/server'
    );

    if (options?.stream && !renderToReadableStream) {
      if (
        typeof process !== 'undefined' &&
        process.versions &&
        process.versions.node
      ) {
        console.log('Running in Node.js');
      }
      if (typeof window !== 'undefined') {
        console.log('Running in the browser');
      }
      if (
        typeof self !== 'undefined' &&
        self.constructor.name === 'WorkerGlobalScope'
      ) {
        console.log('Running in Cloudflare Workers');
      }
      throw new Error(
        'React streaming is not supported in this environment. Please use a compatible environment.'
      );
    }

    if (options?.stream && renderToReadableStream) {
      const stream = await renderToReadableStream(
        createElement(RequestContext.Provider, { value: ctx }, node as string),
        typeof options.stream === 'object' ? options.stream?.options || {} : {}
      );

      if (typeof options.stream === 'object' && options.stream.headers) {
        Object.entries(options.stream.headers).forEach(([key, value]) => {
          ctx.header(key, value);
        });
      } else {
        ctx.header('Transfer-Encoding', 'chunked');
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
      }

      return ctx.body(stream);
    }

    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';
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
