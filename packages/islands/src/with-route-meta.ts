import type { Handler } from 'hono';

export interface RouteMeta {
  sitemap: {
    lastmod: string;
    changefreq: string;
    priority: number;
  };
}

/**
 * Set the meta data for a route.
 *
 * This function enhances a route handler by attaching meta data to it.
 * The meta data can be used for various purposes, such as generating a sitemap.
 *
 * @param {Handler} route - The route handler function.
 * @param {RouteMeta} meta - The meta data to attach to the route.
 * @return {Handler & RouteMeta} - The enhanced route handler with meta data.
 */
export const withRouteMeta = (
  route: Handler,
  meta: RouteMeta
): Handler & RouteMeta => {
  // Add meta property to the route
  Object.defineProperty(route, 'meta', {
    value: meta,
    writable: false,
  });

  return route as Handler & RouteMeta;
};
