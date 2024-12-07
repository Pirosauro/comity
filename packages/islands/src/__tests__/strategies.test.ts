// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { listenMediaOnce, observeOnce, idle } from '../strategies.js';

describe('listenMediaOnce', () => {
  it('should call the callback when the media query matches', () => {
    const query = '(max-width: 600px)';
    const fn = vi.fn();

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const removeListener = listenMediaOnce(query, fn);

    expect(fn).toHaveBeenCalled();
    removeListener();
  });

  it('should remove the event listener when returned function is called', () => {
    const query = '(max-width: 600px)';
    const fn = vi.fn();
    const removeEventListener = vi.fn();

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    }));

    const removeListener = listenMediaOnce(query, fn);

    removeListener();
    expect(removeEventListener).toHaveBeenCalled();
  });
});

describe('observeOnce', () => {
  let observerMock;

  beforeEach(() => {
    observerMock = {
      observe: vi.fn(),
      unobserve: vi.fn(),
    };

    global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      return observerMock;
    });
  });

  it('should not call the callback when the element is not intersecting', () => {
    const element = document.createElement('div');
    const child = document.createElement('div');

    element.appendChild(child);

    const fn = vi.fn();

    // window.IntersectionObserver.mockImplementation((callback) => {
    //   callback([{ isIntersecting: false, target: child }]);

    //   return observerMock;
    // });

    observeOnce(element, fn);
    expect(fn).not.toHaveBeenCalled();
    expect(observerMock.unobserve).not.toHaveBeenCalled();
  });
});

describe('idle', () => {
  it('should call the callback using requestIdleCallback if available', () => {
    const fn = vi.fn();

    window.requestIdleCallback = vi.fn().mockImplementation((cb) => cb());

    idle(fn);
    expect(fn).toHaveBeenCalled();
  });

  it('should call the callback using setTimeout if requestIdleCallback is not available', () => {
    const fn = vi.fn();

    // @ts-expect-error
    window.requestIdleCallback = undefined;
    vi.useFakeTimers();

    idle(fn);
    vi.runAllTimers();
    expect(fn).toHaveBeenCalled();
  });
});
