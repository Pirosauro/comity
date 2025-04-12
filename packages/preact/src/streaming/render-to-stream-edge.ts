import type { VNode } from 'preact';
import { renderToReadableStream } from 'preact-render-to-string/stream';

export const renderToStream = async (node: VNode, options?: {}) => {
  return await renderToReadableStream(node, options);
};
