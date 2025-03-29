import type { ReactNode } from 'react';
import type { RenderToReadableStreamOptions } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server';

export const renderToStream = async (
  node: ReactNode,
  options?: RenderToReadableStreamOptions
) => {
  return await renderToReadableStream(node, options);
};
