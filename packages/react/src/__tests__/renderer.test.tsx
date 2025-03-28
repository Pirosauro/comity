// @vitest-environment jsdom
import type { Mock } from 'vitest';
import type { FC } from 'react';
import type { Context } from 'hono';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useContext } from 'react';
import {
  renderToPipeableStream,
  renderToReadableStream,
  renderToString,
} from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import react, { reactRenderer, useRequestContext } from '../renderer.js';

vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react');

  return {
    ...actual,
    useContext: vi.fn(),
  };
});
vi.mock('react-dom/server', () => ({
  renderToString: vi.fn(),
  renderToReadableStream: vi.fn(),
  renderToPipeableStream: vi.fn(),
}));
vi.mock('react-dom/client', () => ({
  hydrateRoot: vi.fn(),
}));

describe('reactRenderer middleware', () => {
  let ctx: Partial<Context>;
  let next: Mock;
  let renderer: any;
  let setRenderer: Mock;

  beforeEach(() => {
    setRenderer = vi.fn();
    next = vi.fn();
    ctx = {
      html: vi.fn(),
      header: vi.fn(),
      body: vi.fn(),
      setRenderer: (r: any) => {
        renderer = r;
        setRenderer(r);
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set the renderer on the context', async () => {
    const middleware = reactRenderer();

    await middleware(ctx as Context, next);

    expect(setRenderer).toHaveBeenCalledWith(expect.any(Function));
    expect(next).toHaveBeenCalled();
  });

  it('should render the component to a string', async () => {
    const middleware = reactRenderer();

    await middleware(ctx as Context, next);
    await renderer(<span>Test</span>);

    expect(renderToString).toHaveBeenCalled();
  });

  it('should include the doctype if specified', async () => {
    const middleware = reactRenderer(undefined, { docType: true });

    await middleware(ctx as Context, next);
    await renderer(<span>Test</span>);

    expect(renderToString).toHaveBeenCalled();
    expect(ctx.html).toHaveBeenCalledWith(
      expect.stringContaining('<!DOCTYPE html>')
    );
  });

  // it('should handle invalid components gracefully', async () => {
  //   const middleware = reactRenderer();

  //   await middleware(ctx as Context, next);
  //   await expect(() => renderer(null)).toThrow(
  //     'Invalid component provided to the renderer.'
  //   );
  // });

  it('should render the component to a readable stream', async () => {
    const middleware = reactRenderer(undefined, { stream: true });

    await middleware(ctx as Context, next);
    await renderer(<span>Stream Test</span>);

    expect(renderToReadableStream).toHaveBeenCalled();
  });

  // it('should render the component to a pipeable stream', async () => {
  //   const middleware = reactRenderer(undefined, { stream: true });

  //   await middleware(ctx as Context, next);
  //   await renderer(<span>Pipeable Test</span>);

  //   expect(renderToPipeableStream).toHaveBeenCalled();
  // });

  // it('should inject custom HTML into the response', async () => {
  //   const middleware = reactRenderer(({ children }) => children, {
  //     docType: true,
  //   });

  //   await middleware(ctx as Context, next);
  //   await renderer(<>Custom HTML</>);

  //   expect(ctx.html).toHaveBeenCalledWith('<!DOCTYPE html>Custom HTML');
  // });

  it('should handle multiple render calls correctly', async () => {
    const middleware = reactRenderer();

    await middleware(ctx as Context, next);
    await renderer(<span>First Render</span>);
    await renderer(<span>Second Render</span>);

    expect(renderToString).toHaveBeenCalledTimes(2);
  });
});

describe('useRequestContext', () => {
  it('should throw an error if context is not provided', async () => {
    expect(() => useRequestContext()).toThrow(
      'RequestContext is not provided.'
    );
  });

  it('should return the correct context when provided', async () => {
    const mockContext = { key: 'value' };

    vi.mocked(useContext).mockReturnValueOnce(mockContext);

    const result = useRequestContext();

    expect(result).toBe(mockContext);
  });
});

describe('react', () => {
  it('should hydrate the component on the client', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const container = document.getElementById('root') as HTMLDivElement;
    const TestComponent: FC = () => <div>Hydrated</div>;

    await react(TestComponent, {}, container);

    expect(hydrateRoot).toHaveBeenCalled();
  });
});
