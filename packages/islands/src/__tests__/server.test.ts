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
});
