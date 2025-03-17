// @vitest-environment jsdom
import type { Mock } from 'vitest';
import type { FC } from 'hono/jsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { renderToString } from 'hono/jsx/dom/server';
import { hydrateRoot } from 'hono/jsx/dom/client';
import hono, { honoRenderer, useRequestContext } from '../renderer.js';

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

  // it('should return the context if provided', async () => {
  //   const mockContext = { some: 'context' } as unknown as Context;

  //   (useRequestContext as Mock).mockReturnValue(mockContext);

  //   const result = useRequestContext();

  //   expect(result).toBe(mockContext);
  // });
});

// describe('honoRenderer', () => {
//   it('should set the renderer on the context', async () => {
//     const TestComponent: FC = () => <div>Test</div>;
//     const options = { docType: true };

//     const middleware = honoRenderer(TestComponent, options);

//     await middleware(ctx as Context, next);

//     expect(setRenderer).toHaveBeenCalled();
//     expect(next).toHaveBeenCalled();
//   });

//   it('should render the component to a string', async () => {
//     const TestComponent: FC = () => <div>Test</div>;
//     const options = { docType: true };

//     const middleware = honoRenderer(TestComponent, options);
//     await middleware(ctx as Context, next);

//     const renderer = setRenderer.mock.calls[0][0];
//     const result = await renderer(<TestComponent />, {});

//     expect(renderToString).toHaveBeenCalled();
//     expect(ctx.html).toHaveBeenCalledWith(expect.any(String));
//   });
// });

describe('hono', () => {
  it('should hydrate the component on the client', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const container = document.getElementById('root') as HTMLDivElement;
    const TestComponent: FC = () => <div>Hydrated</div>;

    await hono(TestComponent, {}, container);

    expect(hydrateRoot).toHaveBeenCalled();
  });

  it('should render the component with props', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const container = document.getElementById('root') as HTMLDivElement;
    const TestComponent: FC<{ message: string }> = ({ message }) => (
      <div>{message}</div>
    );

    // @ts-ignore
    await hono(TestComponent, { message: 'Hello' }, container);

    expect(hydrateRoot).toHaveBeenCalled();
  });
});
