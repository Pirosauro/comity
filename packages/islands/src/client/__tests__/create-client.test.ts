// @vitest-environment jsdom
import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { waitFor } from '@testing-library/dom';
import { createClient } from '../create-client.js';
import { a } from 'vitest/dist/chunks/suite.qtkXWc6R.js';

describe('createClient', async () => {
  let readyState: DocumentReadyState;
  let consoleLog: typeof console.log;
  let consoleError: typeof console.error;
  let consoleInfo: typeof console.info;
  let consoleWarn: typeof console.warn;

  const mockComponent = vi.fn();
  const mockComponents = {
    TestComponent: vi.fn().mockResolvedValue({ default: mockComponent }),
  };
  const mockIntegrations = {
    react: vi.fn(),
  };
  const options = {
    debug: true,
    components: mockComponents,
    integrations: mockIntegrations,
  };

  await createClient(options);
  await window.customElements.whenDefined('comity-island');

  beforeEach(() => {
    readyState = document.readyState;
  });

  afterEach(() => {
    document.body.innerHTML = '';

    Object.defineProperty(document, 'readyState', {
      value: readyState,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  beforeAll(() => {
    consoleLog = console.log;
    consoleError = console.error;
    consoleInfo = console.info;
    consoleWarn = console.warn;
    console.log = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
  });

  afterAll(() => {
    console.log = consoleLog;
    console.error = consoleError;
    console.info = consoleInfo;
    console.warn = consoleWarn;
  });

  function createIsland(
    params: string,
    parent: HTMLElement = document.body
  ): HTMLElement {
    const customElement = document.createElement('comity-island');
    const script = document.createElement('script');

    script.setAttribute('data-island', '');
    script.setAttribute('type', 'application/json');

    script.textContent = params;

    customElement.appendChild(script);
    parent.appendChild(customElement);

    return customElement;
  }

  it('should log a warning if hydration data is missing', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {};

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(console.warn).toHaveBeenCalledWith(
      '[comity-island] Unable to hydrate Island: missing hydration information'
    );
  });

  it('should log a warning if component is not found', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'NonExistentComponent',
      framework: 'react',
      strategy: { type: 'load' },
    };

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(console.warn).toHaveBeenCalledWith(
      '[comity-island] Unable to hydrate Island: component "NonExistentComponent" not found'
    );
  });

  it('should log an error if integration is not defined', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'TestComponent',
      framework: 'vue',
      strategy: { type: 'load' },
    };

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(console.error).toHaveBeenCalledWith(
      '[comity-island] Unable to hydrate Island: Integration "vue" is not defined'
    );
  });

  it('should hydrate the component when strategy is load', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'TestComponent',
      framework: 'react',
      strategy: { type: 'load' },
    };

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await waitFor(() => expect(mockIntegrations.react).toHaveBeenCalled(), {
      timeout: 5000,
    });
  });

  it('should hydrate the component when strategy is idle', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'TestComponent',
      framework: 'react',
      strategy: { type: 'idle' },
    };

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await waitFor(() => expect(mockIntegrations.react).toHaveBeenCalled(), {
      timeout: 5000,
    });
  });

  it('should hydrate the component when strategy is media', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'TestComponent',
      framework: 'react',
      strategy: { type: 'media', value: '(max-width: 600px)' },
    };

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await waitFor(() => expect(mockIntegrations.react).toHaveBeenCalled(), {
      timeout: 5000,
    });
  });

  // it('should hydrate the component when strategy is visible', async () => {
  //   Object.defineProperty(document, 'readyState', {
  //     value: 'complete',
  //     configurable: true,
  //   });

  //   const params = {
  //     component: 'TestComponent',
  //     framework: 'react',
  //     strategy: { type: 'visible' },
  //   };

  //   const observerMock = {
  //     observe: vi.fn(),
  //     unobserve: vi.fn(),
  //   };

  //   global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
  //     callback([{ isIntersecting: true, target: document.body }]);

  //     return observerMock;
  //   });

  //   createIsland(JSON.stringify(params));
  //   document.dispatchEvent(new Event('DOMContentLoaded'));

  //   await waitFor(() => expect(mockIntegrations.react).toHaveBeenCalled(), {
  //     timeout: 5000,
  //   });
  // });

  it('should not hydrate the component if it is a descendant of another island', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
    });

    const params = {
      component: 'TestComponent',
      framework: 'react',
      strategy: { type: 'load' },
    };

    const parentIsland = createIsland(JSON.stringify(params));
    const childIsland = createIsland(JSON.stringify(params), parentIsland);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    await waitFor(
      () =>
        expect(console.info).toHaveBeenCalledWith(
          '[comity-island] Island "TestComponent" is a descendant of another island'
        ),
      {
        timeout: 5000,
      }
    );

    expect(mockIntegrations.react).toHaveBeenCalledOnce();
  });
});
