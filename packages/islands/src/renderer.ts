import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import type { FC, Child, DOMAttributes } from 'hono/jsx';
import { createContext, createElement, useContext } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
import { hydrateRoot } from 'hono/jsx/dom/client';

export type Options = {
  docType?: boolean | string;
};

export type Props = {};

export type ComponentProps = Props & {
  ctx: Context;
  children: Child;
};

const RequestContext = createContext<Context | null>(null);

/**
 * Create the renderer
 *
 * @param {Context} ctx
 * @param {FC<ComponentProps>} component
 * @param {Options} [options]
 * @return {any}
 */
const createRenderer =
  (ctx: Context, component: FC<ComponentProps>, options?: Options): any =>
  async (children: Child, props?: Props) => {
    const node = component ? component({ children, ctx, ...props }) : children;
    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';
    const body =
      docType +
      renderToString(
        // @ts-ignore
        createElement(RequestContext.Provider, { value: ctx }, node)
      );

    return ctx.html(body);
  };

/**
 * Hono JSX renderer middleware
 *
 * @param {FC<ComponentProps>} component - The component to render
 * @param {Options} options - The rendering options
 * @return {MiddlewareHandler}
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
const hono = async (
  component: FC,
  props: DOMAttributes,
  element: HTMLElement
) => {
  const target = await createElement(component, props);

  await hydrateRoot(element, target);
};

export default hono;
