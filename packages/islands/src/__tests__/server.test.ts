import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { Server } from '../server.js';

describe('Server', () => {
  let server: Server;
  let consoleLog: typeof console.log;

  beforeEach(() => {
    consoleLog = console.log;
    console.log = vi.fn();
    server = new Server();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it('should register routes correctly', () => {
    const routes = {
      '/test.all': vi.fn(),
      '/test.delete': vi.fn(),
      '/test.patch': vi.fn(),
      '/test.post': vi.fn(),
      '/test.put': vi.fn(),
      '/index.get': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith(
      '\u001B[34mRegistering routes and middlewares\u001B[0m'
    );
    expect(console.log).toHaveBeenCalledWith('*', '/test');
    expect(console.log).toHaveBeenCalledWith('DELETE', '/test');
    expect(console.log).toHaveBeenCalledWith('PATCH', '/test');
    expect(console.log).toHaveBeenCalledWith('POST', '/test');
    expect(console.log).toHaveBeenCalledWith('PUT', '/test');
    expect(console.log).toHaveBeenCalledWith('GET', '/');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 6/6 items registered\u001B[0m'
    );
  });

  it('should register custom 404 handler', () => {
    const routes = {
      '/_404': vi.fn(),
    };

    server.notFound = vi.fn();

    server.registerRoutes(routes);

    expect(server.notFound).toHaveBeenCalledWith(routes['/_404']);
    expect(console.log).toHaveBeenCalledWith('*', '/*', '(404 handler)');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should register custom 500 handler', () => {
    const routes = {
      '/_500': vi.fn(),
    };

    server.onError = vi.fn();

    server.registerRoutes(routes);

    expect(server.onError).toHaveBeenCalledWith(routes['/_500']);
    expect(console.log).toHaveBeenCalledWith('*', '/*', '(error handler)');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should default to * for not specified methods', () => {
    const routes = {
      '/test': vi.fn(),
      '/test.txt': vi.fn(),
      '/test.invalid': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/test');
    expect(console.log).toHaveBeenCalledWith('*', '/test.txt');
    expect(console.log).toHaveBeenCalledWith('*', '/test.invalid');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 3/3 items registered\u001B[0m'
    );
  });

  it('should register middleware correctly', () => {
    const routes = {
      '/test/_middleware': vi.fn(),
    };

    server.use = vi.fn();

    server.registerRoutes(routes);

    expect(server.use).toHaveBeenCalledWith(
      '/test/*',
      routes['/test/_middleware']
    );
    expect(console.log).toHaveBeenCalledWith('*', '/test/*', '(middleware)');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should generate sitemap.xml correctly', async () => {
    const routes = {
      '/test.get': vi.fn(),
    };
    (routes['/test.get'] as any).meta = { sitemap: { priority: 0.8 } };

    server.get = vi.fn();

    server.registerRoutes(routes, {
      sitemap: { baseUrl: 'http://example.com' },
    });

    expect(server.get).toHaveBeenCalledWith(
      '/sitemap.xml',
      expect.any(Function)
    );
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should ignore invalid routes', () => {
    const routes = {
      '/_invalid': vi.fn(),
      '/test/_invalid': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 0/2 items registered\u001B[0m'
    );
  });

  it('should handle routes with dynamic parameters', () => {
    const routes = {
      '/user/:id': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/user/:id');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should handle routes with query parameters', () => {
    const routes = {
      '/search?query=test': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/search?query=test');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should handle routes with hash fragments', () => {
    const routes = {
      '/page#section': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/page#section');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should handle routes with multiple methods', () => {
    const routes = {
      '/test.get': vi.fn(),
      '/test.post': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('GET', '/test');
    expect(console.log).toHaveBeenCalledWith('POST', '/test');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 2/2 items registered\u001B[0m'
    );
  });

  it('should handle routes with nested paths', () => {
    const routes = {
      '/parent/child': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/parent/child');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should handle routes with file extensions', () => {
    const routes = {
      '/file.txt': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/file.txt');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });

  it('should handle routes with special characters', () => {
    const routes = {
      '/special-!@#$%^&*()': vi.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith('*', '/special-!@#$%^&*()');
    expect(console.log).toHaveBeenCalledWith(
      '\u001B[33m[OK] 1/1 items registered\u001B[0m'
    );
  });
});
