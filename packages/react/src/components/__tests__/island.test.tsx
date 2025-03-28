// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

vi.mock('virtual:comity-islands', () => ({
  C_testModule: async () => ({
    default: ({ message }: { message: string }) => <div>{message}</div>,
  }),
}));

import { Island } from '../island.js';
import { render } from '@testing-library/react';

describe('Island Component', () => {
  // it('renders the component when $component is valid', async () => {
  //   const { findByText } = render(
  //     <Island $client:load $component="testModule" message="Hello, Island!" />
  //   );

  //   const element = await findByText('Hello, Island!');

  //   expect(element).toBeInTheDocument();
  // });

  it('throws an error when $component is not provided', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Island $client:load $component="" />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading component:',
      'The $component property is required but was not provided.'
    );

    consoleErrorSpy.mockRestore();
  });

  it('throws an error when the component does not exist', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Island $client:load $component="nonExistentModule#default" />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading component:',
      'Ensure that the component "nonExistentModule#default" exists and is exported correctly.'
    );

    consoleErrorSpy.mockRestore();
  });

  it('handles async errors gracefully', async () => {
    vi.mock('virtual:comity-islands', () => ({
      C_testModule: async () => {
        throw new Error('Async error');
      },
    }));

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Island $client:load $component="testModule#default" />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading component:',
      'Async error'
    );

    consoleErrorSpy.mockRestore();
  });
});
