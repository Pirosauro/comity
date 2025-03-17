// @vitest-environment jsdom
import type { FC } from 'react';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { getHydrationData } from '@comity/islands';
import { withHydration } from '../with-hydration.js';

vi.mock('@comity/islands', () => ({
  getHydrationData: vi.fn(),
}));

describe('withHydration', () => {
  const MockComponent: FC<{ message: string }> = ({ message }) => (
    <div>{message}</div>
  );

  it('should render the component statically when no hydration strategy is provided', () => {
    (getHydrationData as Mock).mockReturnValueOnce({
      strategy: null,
      props: { message: 'Hello, World!' },
    });

    const HydratedComponent = withHydration(MockComponent, 'TestComponent');
    const { container } = render(
      <HydratedComponent $client:load message="Hello, World!" />
    );

    expect(container.innerHTML).toBe('<div>Hello, World!</div>');
  });

  it('should render the component with hydration when a strategy is provided', () => {
    const hydrationData = {
      strategy: 'load',
      props: { message: 'Hello, Hydration!' },
    };
    (getHydrationData as Mock).mockReturnValueOnce(hydrationData);

    const HydratedComponent = withHydration(MockComponent, 'TestComponent');
    const { container } = render(
      <HydratedComponent $client:load message="Hello, Hydration!" />
    );

    expect(container.querySelector('comity-island')).not.toBeNull();
    expect(container.querySelector('div')?.textContent).toBe(
      'Hello, Hydration!'
    );
    expect(
      container.querySelector('script')?.getAttribute('data-island')
    ).not.toBeNull();
    expect(container.querySelector('script')?.innerHTML).toBe(
      JSON.stringify(hydrationData)
    );
  });
});
