import type { Context } from 'hono';
import type { Env, MiddlewareHandler } from 'hono/types';
import { createApp, createSSRApp, h, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';

export type Options = {
  docType?: boolean | string;
};

export type Props = {};

export type ComponentProps = Props & {
  ctx: Context;
};

const RequestContext = ref<Context<Env> | null>(null);

/**
 * Create the renderer
 *
 * @param {Context} ctx - The request context.
 * @param {any} [component] - The Vue component to render.
 * @param {Options} [options] - Optional rendering options.
 * @return {(children: FunctionalComponent, props?: Props) => Promise<Response>}
 */
const createRenderer =
  (ctx: Context, component?: any, options?: Options) =>
  async (children: any, props?: Props) => {
    const node = component
      ? component(
          { ...props, ctx },
          {
            slots: {
              default:
                typeof children === 'function'
                  ? children
                  : () => h(children || []),
            },
          }
        )
      : typeof children === 'function'
      ? children
      : () => h(children || []);
    const docType =
      typeof options?.docType === 'string'
        ? options.docType
        : options?.docType === true
        ? '<!DOCTYPE html>'
        : '';
    const app = createSSRApp({
      setup() {
        RequestContext.value = ctx;
      },
      render: () => node,
    });
    const body = docType + (await renderToString(app));

    return ctx.html(body);
  };

/**
 * Vue renderer middleware
 *
 * @param {any} component - The component to render.
 * @param {Options} options - The rendering options.
 * @return {MiddlewareHandler}
 */
export const vueRenderer =
  (component?: any, options?: Options): MiddlewareHandler =>
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
  const ctx = RequestContext.value;

  if (!ctx) {
    throw new Error('RequestContext is not provided.');
  }

  // @ts-ignore
  return ctx;
};

/**
 * Component renderer
 *
 * @param {any} component - The component to render.
 * @param {any} props - The component's props.
 * @param {HTMLElement} element - The parent HTMLElement.
 */
const vue = async (component: any, props: any, element: HTMLElement) => {
  const app = createApp({
    render: () => h(component, props),
  });

  app.mount(element);
};

export default vue;
