// @vitest-environment jsdom
import type { Mock } from 'vitest';
import type { FC } from 'hono/jsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { renderToString } from 'hono/jsx/dom/server';
import { hydrateRoot } from 'hono/jsx/dom/client';
import hono, { honoRenderer, useRequestContext } from '../renderer.js';

// vi.mock("hono", () => ({
//   Context: vi.fn(),
// }));

vi.mock('hono', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('hono');

  return {
    ...actual,
    useContext: vi.fn(),
  };
});
vi.mock('hono/jsx/dom/server', () => ({
  renderToString: vi.fn(),
}));
vi.mock('hono/jsx/dom/client', () => ({
  hydrateRoot: vi.fn(),
}));

const renderer = (node: any) => node.toString();

// describe('honoRenderer middleware', () => {
//   let ctx: Partial<Context>;
//   let next: Mock;
//   let setRenderer: Mock;

//   beforeEach(() => {
//     setRenderer = vi.fn();
//     next = vi.fn();
//     ctx = {
//       html: vi.fn(),
//       setRenderer,
//     };
//   });

//   it('should set the renderer on the context', async () => {
//     const middleware = honoRenderer();

//     await middleware(ctx as Context, next);

//     expect(setRenderer).toHaveBeenCalledWith(expect.any(Function));
//     expect(next).toHaveBeenCalled();
//   });

//   it('should render the component to a string', async () => {
//     const middleware = honoRenderer();

//     await middleware(ctx as Context, next);
//     await renderer(<span>Test</span>);

//     expect(renderToString).toHaveBeenCalled();
//   });

//   it('should include the doctype if specified', async () => {
//     const middleware = honoRenderer(undefined, { docType: true });

//     await middleware(ctx as Context, next);
//     await renderer(<span>Test</span>);

//     expect(renderToString).toHaveBeenCalled();
//     expect(ctx.html).toHaveBeenCalledWith(
//       expect.stringContaining('<!DOCTYPE html>')
//     );
//   });
// });

describe('useRequestContext', async () => {
  let ctx: Partial<Context>;
  let next: Mock;
  let setRenderer: Mock;

  beforeEach(() => {
    setRenderer = vi.fn();
    next = vi.fn();
    ctx = {
      html: vi.fn(),
      setRenderer,
    };
  });

  it('should throw an error if context is not provided', async () => {
    expect(() => useRequestContext()).toThrow(
      'RequestContext is not provided.'
    );
  });
});

describe('hono', () => {
  it('should hydrate the component on the client', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const container = document.getElementById('root') as HTMLDivElement;
    const TestComponent: FC = () => <div>Hydrated</div>;

    await hono(TestComponent, {}, container);

    expect(hydrateRoot).toHaveBeenCalled();
  });
});
