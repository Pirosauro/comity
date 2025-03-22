import { jsxRenderer } from 'hono/jsx-renderer';

function detectEnvironment() {
  if (typeof window !== 'undefined') {
    // Browser
    console.log('Running in the browser');
    return 'browser';
  }

  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    // Node.js
    console.log('Running in Node.js');
    return 'node';
  }

  if (
    typeof self !== 'undefined' &&
    self.constructor.name === 'WorkerGlobalScope'
  ) {
    // Cloudflare Workers
    console.log('Running in Cloudflare Workers environment');
    return 'cloudflare';
  }

  return 'unknown';
}

export const renderer = jsxRenderer(
  ({ children }) => {
    return (
      <html>
        <head>
          <link href="/static/style.css" rel="stylesheet" />
        </head>
        <body>
          {children}
          <p>Env: {detectEnvironment()}</p>
        </body>
      </html>
    );
  },
  { stream: true }
);
