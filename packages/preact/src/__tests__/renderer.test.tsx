// @vitest-environment jsdom
import type { Mock } from 'vitest';
import type { FunctionComponent as FC } from 'preact';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { renderToString } from 'preact-render-to-string';
import { hydrate } from 'preact';
import preact, { preactRenderer, useRequestContext } from '../renderer.js';

vi.mock('preact', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('preact');

  return {
    ...actual,
    createContext: vi.fn(),
  };
});
vi.mock('preact/hooks', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('preact/hooks');

  return {
    ...actual,
    useContext: vi.fn(),
  };
});
vi.mock('preact-render-to-string', () => ({
  renderToString: vi.fn(),
}));
vi.mock('preact', () => ({
  hydrate: vi.fn(),
}));

describe('preactRenderer middleware', () => {
  let ctx: Partial<Context>;
  let next: Mock;
  let renderer: any;
  let setRenderer: Mock;

  beforeEach(() => {
    setRenderer = vi.fn();
    next = vi.fn();
    ctx = {
      html: vi.fn(),
      setRenderer: (r: any) => {
        renderer = r;

        setRenderer(r);
      },
    };
  });

  it('should set the renderer on the context', async () => {
    const middleware = preactRenderer();

    await middleware(ctx as Context, next);

    expect(setRenderer).toHaveBeenCalledWith(expect.any(Function));
    expect(next).toHaveBeenCalled();
  });

  it('should render the component to a string', async () => {
    const middleware = preactRenderer();

    await middleware(ctx as Context, next);
    await renderer(<span>Test</span>);

    expect(renderToString).toHaveBeenCalled();
  });

  it('should include the doctype if specified', async () => {
    const middleware = preactRenderer(undefined, { docType: true });

    await middleware(ctx as Context, next);
    await renderer(<span>Test</span>);

    expect(renderToString).toHaveBeenCalled();
    expect(ctx.html).toHaveBeenCalledWith(
      expect.stringContaining('<!DOCTYPE html>')
    );
  });
});

describe('useRequestContext', async () => {
  let ctx: Partial<Context>;
  let next: Mock;
  let renderer: any;
  let setRenderer: Mock;

  beforeEach(() => {
    setRenderer = vi.fn();
    next = vi.fn();
    ctx = {
      html: vi.fn(),
      setRenderer: (r: any) => {
        renderer = r;

        setRenderer(r);
      },
    };
  });

  it('should throw an error if context is not provided', async () => {
    expect(() => useRequestContext()).toThrow(
      'RequestContext is not provided.'
    );
  });
});

describe('preact', () => {
  it('should hydrate the component on the client', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const container = document.getElementById('root') as HTMLDivElement;
    const TestComponent: FC = () => <div>Hydrated</div>;

    await preact(TestComponent, {}, container);

    expect(hydrate).toHaveBeenCalled();
  });
});
