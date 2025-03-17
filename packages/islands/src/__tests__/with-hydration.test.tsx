// @vitest-environment jsdom
import type { FC } from 'hono/jsx';
import type { Mock } from 'vitest';
import type {
  ClientDirective,
  HydratableComponent,
} from '../../types/module.d.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { withHydration } from '../with-hydration.js';
import { getHydrationData } from '../get-hydration-data.js';

type Props = {
  message: string;
};

vi.mock('../get-hydration-data.js');

const render = (node: any) => node.toString();
let MockComponent: FC<Props> | HydratableComponent<Props>;
let MockComponentIsland: FC<Props & ClientDirective>;

describe('withHydration', () => {
  beforeEach(() => {
    (getHydrationData as Mock).mockClear();

    MockComponent = ({ message }) => <div>{message}</div>;
    MockComponentIsland = withHydration(MockComponent, 'TestComponent.tsx');
  });

  it('should add filename and framework properties to the component', () => {
    expect((MockComponent as HydratableComponent<Props>).filename).toBe(
      'TestComponent.tsx'
    );
    expect((MockComponent as HydratableComponent<Props>).framework).toBe(
      'hono'
    );
  });

  it('should not allow modification of filename and framework properties', () => {
    expect(() => {
      (MockComponent as HydratableComponent<Props>).filename =
        'NewFilename.tsx';
    }).toThrowError(TypeError);

    expect(() => {
      (MockComponent as HydratableComponent<Props>).framework = 'vue';
    }).toThrowError(TypeError);
  });

  it('should render the component statically when no hydration strategy is provided', () => {
    (getHydrationData as Mock).mockReturnValueOnce({
      strategy: null,
      props: { message: 'Hello, World!' },
    });

    const document = new JSDOM(
      /* @ts-expect-error */
      render(<MockComponentIsland message="Hello, World!" />),
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

    const document = new JSDOM(
      render(<MockComponentIsland $client:load message="Hello, Hydration!" />),
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
