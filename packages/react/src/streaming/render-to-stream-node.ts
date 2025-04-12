import type { ReactNode } from 'react';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';

export const renderToStream = async (
  node: ReactNode,
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
