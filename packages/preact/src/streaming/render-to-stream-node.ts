import type { VNode } from 'preact';
import type { RenderToPipeableStreamOptions } from 'preact-render-to-string/stream-node';
import { renderToPipeableStream } from 'preact-render-to-string/stream-node';

export const renderToStream = async (
  node: VNode,
  options?: RenderToPipeableStreamOptions
) => {
  const { PassThrough } = await import('stream');
  const pt = new PassThrough({ highWaterMark: 16384 }); // Limit buffer size

  // Pipe to PassThrough stream when shell is ready
  const { pipe } = renderToPipeableStream(node, {
    ...options,
    onShellReady() {
      pipe(pt); // Pipe to PassThrough stream when shell is ready
    },
    onError(error) {
      throw error;
    },
  });

  const stream = new ReadableStream({
    start(controller) {
      pt.on('data', (chunk) => controller.enqueue(chunk));
      pt.on('end', () => controller.close());
      pt.on('error', (err) => controller.error(err));
    },
  });

  return stream;
};
