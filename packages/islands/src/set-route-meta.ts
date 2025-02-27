import type { Context } from 'hono';

export interface RouteMeta {
  sitemap: {
    lastmod: string;
    changefreq: string;
    priority: number;
  };
}

export const setRouteMeta = (
  route: (ctx: Context) => Response | Promise<Response>,
  meta: RouteMeta
) =>
  Object.defineProperty(route, 'meta', {
    value: meta,
    writable: false,
  });
