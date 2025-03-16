import type { Context } from 'hono';
import { describe, it, expect } from 'vitest';
import { withRouteMeta, RouteMeta } from '../with-route-meta.js';

describe('setRouteMeta', () => {
  it('should set meta property on the route function', () => {
    const route = (ctx: Context) => new Response('OK');
    const meta: RouteMeta = {
      sitemap: {
        lastmod: '2023-10-01',
        changefreq: 'daily',
        priority: 0.8,
      },
    };

    withRouteMeta(route, meta);

    expect((route as any).meta).toEqual(meta);
  });

  it('should make meta property non-writable', () => {
    const route = (ctx: Context) => new Response('OK');
    const meta: RouteMeta = {
      sitemap: {
        lastmod: '2023-10-01',
        changefreq: 'daily',
        priority: 0.8,
      },
    };

    withRouteMeta(route, meta);

    expect(() => {
      (route as any).meta = {};
    }).toThrow(TypeError);
  });
});
