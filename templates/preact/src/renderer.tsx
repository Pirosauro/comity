import { preactRenderer } from '@comity/preact';
import { renderToStream } from '@comity/preact/streaming';

export const renderer = preactRenderer(
  ({ children, title }) => {
    return (
      <html lang="en">
        <head>
          <title>{title}</title>
          {import.meta.env.PROD && (
            <link
              rel="stylesheet"
              href="/static/assets/client.css"
              media="all"
              type="text/css"
            />
          )}
        </head>
        <body>{children}</body>
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js" defer async></script>
        ) : (
          <script type="module" src="/src/client.ts" defer async></script>
        )}
      </html>
    );
  },
  {
    stream: {
      renderToStream,
      options: {
        onError(error) {
          console.error('Error rendering to stream:', error);
        },
      },
    },
  }
);
