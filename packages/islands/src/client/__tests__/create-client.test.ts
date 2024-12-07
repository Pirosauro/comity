// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from '../create-client.js';

describe('createClient', async () => {
  let readyState: DocumentReadyState;
  let consoleLog: typeof console.log;
  let consoleError: typeof console.error;
  let consoleInfo: typeof console.info;
  let consoleWarn: typeof console.warn;

  const mockComponent = vi.fn();
  const mockIslands = {
    TestComponent: () => Promise.resolve({ default: mockComponent }),
  };
  const mockIntegrations = {
    react: vi.fn().mockResolvedValue(undefined),
  };
  const options = {
    debug: true,
    islands: mockIslands,
    integrations: mockIntegrations,
  };

  await createClient(options);
  await window.customElements.whenDefined('comity-island');

  function createIsland(params: string) {
    const customElement = document.createElement('comity-island');
    const script = document.createElement('script');

    script.setAttribute('data-island', '');
    script.setAttribute('type', 'application/json');

    script.textContent = params;

    customElement.appendChild(script);
    document.body.appendChild(customElement);
  }

  beforeEach(() => {
    consoleLog = console.log;
    consoleError = console.error;
    consoleInfo = console.info;
    consoleWarn = console.warn;
    console.log = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    readyState = document.readyState;
  });

  afterEach(() => {
    console.log = consoleLog;
    console.error = consoleError;
    console.info = consoleInfo;
    console.warn = consoleWarn;
    document.body.innerHTML = '';

    Object.defineProperty(document, 'readyState', {
      value: readyState,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  // it("should initialize islands on DOMContentLoaded", async () => {
  //   Object.defineProperty(document, "readyState", {
  //     value: "loading",
  //     configurable: true,
  //   });

  //   const params = {
  //     name: "TestComponent",
  //     framework: "react",
  //     strategy: { type: "load" },
  //   };

  //   createIsland(JSON.stringify(params));
  //   document.dispatchEvent(new Event("DOMContentLoaded"));

  //   expect(window.customElements.get("comity-island")).to.exist;
  //   expect(console.info).toHaveBeenCalledWith(
  //     '[comity-island] Island "TestComponent" initialized'
  //   );
  //   expect(mockComponent).toHaveBeenCalled();
  // });

  // it("should initialize islands if DOMContentLoaded has already fired", async () => {
  //   Object.defineProperty(document, "readyState", {
  //     value: "done",
  //     configurable: true,
  //   });

  //   const params = {
  //     name: "TestComponent",
  //     framework: "react",
  //     strategy: { type: "load" },
  //   };

  //   createIsland(JSON.stringify(params));
  //   document.dispatchEvent(new Event("DOMContentLoaded"));

  //   expect(window.customElements.get("comity-island")).to.exist;
  //   expect(console.info).toHaveBeenCalledWith(
  //     '[comity-island] Island "TestComponent" initializaed'
  //   );
  //   expect(mockComponent).toHaveBeenCalled();
  // });

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
      name: 'NonExistentComponent',
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
      name: 'TestComponent',
      framework: 'vue',
      strategy: { type: 'load' },
    };

    createIsland(JSON.stringify(params));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(console.error).toHaveBeenCalledWith(
      '[comity-island] Unable to hydrate Island: integration "vue" is not defined'
    );
  });

  // it("should log an error if component loading fails", async () => {
  //   Object.defineProperty(document, "readyState", {
  //     value: "complete",
  //     configurable: true,
  //   });

  //   const params = {
  //     name: "TestComponent",
  //     framework: "react",
  //     strategy: { type: "load" },
  //   };

  //   createIsland(JSON.stringify(params));
  //   document.dispatchEvent(new Event("DOMContentLoaded"));

  //   expect(console.error).toHaveBeenCalledWith(
  //     '[comity-island] Unable to hydrate Island: loading of component "TestComponent" has failed'
  //   );
  // });

  // it("should hydrate component on load strategy", async () => {
  //   // Mock document.readyState
  //   Object.defineProperty(document, "readyState", {
  //     value: "complete",
  //     configurable: true,
  //   });

  //   const script = document.createElement("script");

  //   script.setAttribute("data-island", "");
  //   script.textContent = JSON.stringify({
  //     name: "TestComponent",
  //     framework: "react",
  //     strategy: { type: "load" },
  //   });

  //   document.body.appendChild(script);

  //   await createClient(options);

  //   expect(mockIntegrations.react).toHaveBeenCalled();
  // });
});
