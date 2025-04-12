import type { Handler } from 'hono';
import type { RouteMeta } from '../with-route-meta';
import { stream } from 'hono/streaming';

export const sitemapXml = (
  baseUrl: string,
  sitemap: Record<string, RouteMeta['sitemap']>
): Handler => {
  return async (ctx) => {
    const head = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    // Stream sitemap.xml
    return stream(ctx, async (stream) => {
      // Set headers
      ctx.header('Content-Type', 'text/xml');
      ctx.header('Content-Encoding', 'Identity');

      // Opening tag
      await stream.write(head);

      Object.entries(sitemap).forEach(async ([path, meta]) => {
        const { lastmod, changefreq, priority } = meta || {};
        const items: string[] = [
          `<loc>${baseUrl + (path === '/' ? '' : path)}</loc>`,
        ];

        // Add priority
        if (priority) {
          items.push(`<priority>${priority.toPrecision(1)}</priority>`);
        }

        // Add changefreq
        if (changefreq) {
          items.push(`<changefreq>${changefreq}</changefreq>`);
        }

        // Add lastmod
        if (lastmod) {
          items.push(`<lastmod>${lastmod}</lastmod>`);
        }

        // Write to stream
        await stream.write(`\n<url>${items.join('\n')}</url>`);
      });

      // Closing tag
      await stream.write(`\n</urlset>`);
    });
  };
};
