import type { Env, Schema } from 'hono';
import type {
  H,
  NotFoundHandler,
  ErrorHandler,
  BlankEnv,
  BlankSchema,
} from 'hono/types';
import { Hono } from 'hono';

export class Server<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema,
  BasePath extends string = '/'
> extends Hono<E, S, BasePath> {
  registerRoutes(routes: Record<string, H | ErrorHandler>) {
    let count = 0;

    console.log('\u001B[34mRegistering routes\u001B[0m');

    Object.entries(routes).forEach(([route, handler]) => {
      // parse route into path and method
      const [, path, method = 'get'] =
        route.match(/^(.*?)(?:\.(all|delete|get|patch|post|put))?$/) || [];

      // custom 404 page
      if (path === '/_404') {
        this.notFound(handler as NotFoundHandler);
        console.log('404');

        return ++count;
      }

      // error handling
      if (path === '/_500') {
        this.onError(handler as ErrorHandler);
        console.log('500');

        return ++count;
      }

      if (path.endsWith('/_middleware')) {
        const p = path.replace(/\/_middleware$/, '/*');

        this.use(p, handler as H);
        console.log('MIDDLEWARE', p);

        return ++count;
      }

      // ignore invalid routes
      if (!path || path.match(/\/_[^\/]+$/) || !method || !handler) return;

      // register route handler on Hono
      this.on(
        method,
        path === '/index' ? '/' : path,
        ...([Array.isArray(handler) ? handler : [handler]] as H[])
      );
      console.log(
        method.replace('all', '*').toUpperCase(),
        path === '/index' ? '/' : path
      );

      count++;
    });

    console.log('\u001B[33m[OK] ' + count + ' routes registered\u001B[0m');
  }
}
