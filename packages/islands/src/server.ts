import type { Env, Schema } from 'hono';
import type {
  H,
  NotFoundHandler,
  ErrorHandler,
  BlankEnv,
  BlankSchema,
} from 'hono/types';
import type { RouteMeta } from './set-route-meta.js';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';

export type RoutesOptions = {
  sitemap?: {
    baseUrl: string;
    path?: string;
  };
};

export class Server<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema,
  BasePath extends string = '/'
> extends Hono<E, S, BasePath> {
  registerRoutes(
    routes: Record<string, H | ErrorHandler>,
    options: RoutesOptions = {}
  ) {
    let count = 0;
    const sitemap: Record<string, RouteMeta['sitemap']> = {};

    console.log('\u001B[34mRegistering routes and middlewares\u001B[0m');

    Object.entries(routes).forEach(([route, handler]) => {
      // parse route into path and method
      const [, path, method = 'all'] =
        route.match(
          /^(.*?)(?:\.(all|delete|get|middleware|patch|post|put))?$/
        ) || [];

      // custom 404 page
      if (path === '/_404') {
        this.notFound(handler as NotFoundHandler);
        console.log('*', '/*', '(404 handler)');

        return ++count;
      }

      // error handling
      if (path === '/_500') {
        this.onError(handler as ErrorHandler);
        console.log('*', '/*', '(error handler)');

        return ++count;
      }

      if (path.endsWith('/_middleware') || method === 'middleware') {
        const p = path.replace(/\/_middleware$/, '/*');

        this.use(p, handler as H);
        console.log('*', p, '(middleware)');

        return ++count;
      }

      // ignore invalid routes
      if (!path || path.match(/\/_[^\/]+$/) || !method || !handler) return;

      // normalize path
      const normalized = path.endsWith('/index')
        ? path.slice(0, -6) || '/'
        : path;

      // register route handler on Hono
      this.on(
        method,
        normalized,
        ...(Array.isArray(handler) ? handler : [handler])
      );
      console.log(method.replace('all', '*').toUpperCase(), normalized);

      if (
        ['get', 'all'].includes(method) &&
        options.sitemap &&
        typeof handler === 'object' &&
        Object.hasOwn(handler, 'meta')
      ) {
        sitemap[normalized] = (handler as any).meta?.sitemap;
      }

      ++count;
    });

    // generate sitemap.xml
    if (Object.keys(sitemap).length) {
      this.get(options?.sitemap?.path || '/sitemap.xml', (ctx) => {
        const head = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

        // stream sitemap.xml
        return stream(ctx, async (stream) => {
          // set headers
          ctx.header('Content-Type', 'text/xml');
          ctx.header('Content-Encoding', 'Identity');

          // opening tag
          await stream.write(head);

          Object.entries(sitemap).forEach(async ([path, meta]) => {
            const { lastmod, changefreq, priority } = meta || {};

            const items: string[] = [
              `<loc>${
                options.sitemap!.baseUrl + (path === '/' ? '' : path)
              }</loc>`,
            ];

            // add priority
            if (priority) {
              items.push(`<priority>${priority.toPrecision(1)}</priority>`);
            }

            // add changefreq
            if (changefreq) {
              items.push(`<changefreq>${changefreq}</changefreq>`);
            }

            // add lastmod
            if (lastmod) {
              items.push(`<lastmod>${lastmod}</lastmod>`);
            }

            // write to stream
            await stream.write(`\n<url>${items.join('\n')}</url>`);
          });

          // closing tag
          await stream.write(`\n</urlset>`);
        });
      });
    }

    console.log(
      `\u001B[33m[OK] ${count}/${
        Object.keys(routes).length
      } items registered\u001B[0m`
    );
  }
}
