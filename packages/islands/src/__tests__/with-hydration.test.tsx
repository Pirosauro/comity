// @vitest-environment jsdom
import type { FC } from 'hono/jsx';
import type { Mock } from 'vitest';
import { describe, it, expect, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { withHydration } from '../with-hydration.js';
import { getHydrationData } from '../get-hydration-data.js';

vi.mock('../get-hydration-data.js');

const render = (node: any) => node.toString();

describe('withHydration', () => {
  const MockComponent: FC<{ message: string }> = ({ message }) => (
    <div>{message}</div>
  );

  it('should render the component statically when no hydration strategy is provided', () => {
    (getHydrationData as Mock).mockReturnValueOnce({
      strategy: null,
      props: { message: 'Hello, World!' },
    });

    const ComponentIsland = withHydration(MockComponent);
    const document = new JSDOM(
      /* @ts-expect-error */
      render(<ComponentIsland message="Hello, World!" />),
      { runScripts: 'dangerously' }
    ).window.document;

    expect(document.body.innerHTML).toBe('<div>Hello, World!</div>');
  });

  it('should render the component with hydration when a strategy is provided', () => {
    const hydrationData = {
      strategy: 'load',
      props: { message: 'Hello, Hydration!' },
    };
    (getHydrationData as Mock).mockReturnValueOnce(hydrationData);

    const HydratedComponent = withHydration(MockComponent);
    const document = new JSDOM(
      render(<HydratedComponent client:load message="Hello, Hydration!" />),
      { runScripts: 'dangerously' }
    ).window.document;

    expect(document.querySelector('comity-island')).not.toBeNull();
    expect(document.querySelector('div')?.textContent).toBe(
      'Hello, Hydration!'
    );
    expect(
      document.querySelector('script')?.getAttribute('data-island')
    ).not.toBeNull();
    expect(document.querySelector('script')?.innerHTML).toBe(
      JSON.stringify(hydrationData)
    );
  });
});
