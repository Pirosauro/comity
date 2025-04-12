import type { JSXNode } from 'hono/jsx';
import { renderToReadableStream } from 'hono/jsx/streaming';

export const renderToStream = async (
  node: JSXNode,
  options?: {
    onError?: (error: unknown) => string | void;
  }
) => {
  return await renderToReadableStream(node, options?.onError);
};
