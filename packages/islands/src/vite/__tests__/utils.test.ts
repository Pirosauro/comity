import { describe, it, expect } from 'vitest';
import { normalizePath, sortRoutes } from '../utils.js';

describe('normalizePath', () => {
  it('should normalize paths and filenames to lowercase and add .get if no method is specified', () => {
    expect(normalizePath('/API/Users.ts')).toBe('/api/users.get');
  });

  it('should normalize paths and filenames to lowercase and keep the specified method', () => {
    expect(normalizePath('/API/Users.POST.ts')).toBe('/api/users.post');
    expect(normalizePath('/API/Users.GET.ts')).toBe('/api/users.get');
    expect(normalizePath('/API/Users.PUT.ts')).toBe('/api/users.put');
    expect(normalizePath('/API/Users.DELETE.ts')).toBe('/api/users.delete');
    expect(normalizePath('/API/Users.PATCH.ts')).toBe('/api/users.patch');
  });

  it('should handle filenames with extension correctly', () => {
    expect(normalizePath('/API/Users/Details.txt.GET.ts')).toBe(
      '/api/users/details.txt.get'
    );
    expect(normalizePath('/API/Users/Details.txt.ts')).toBe(
      '/api/users/details.txt.get'
    );
  });
});

describe('sortRoutes', () => {
  it('should sort routes by length, longer paths first, method excluded', () => {
    const routes = [
      '/api/users.get',
      '/api/users.delete',
      '/api/users.post',
      '/api/users/details',
      '/api',
      '/api/users/details/address',
    ];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([
      '/api/users/details/address',
      '/api/users/details',
      '/api/users.get',
      '/api/users.delete',
      '/api/users.post',
      '/api',
    ]);
  });

  it('should sort routes with dynamic segments correctly', () => {
    const routes = [
      '/api/users/[id]',
      '/api/users',
      '/api/users/[id]/details',
      '/api',
    ];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([
      '/api/users/[id]/details',
      '/api/users/[id]',
      '/api/users',
      '/api',
    ]);
  });

  it('should handle routes with and without dynamic segments', () => {
    const routes = [
      '/api/users/[id]',
      '/api/users/details',
      '/api/users',
      '/api/users/[id]/details',
    ];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([
      '/api/users/[id]/details',
      '/api/users/details',
      '/api/users/[id]',
      '/api/users',
    ]);
  });

  it('should handle empty routes array', () => {
    const routes: string[] = [];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([]);
  });

  it('should handle routes with same length correctly', () => {
    const routes = ['/api/users/[id]', '/api/users/details', '/api/users/info'];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([
      '/api/users/details',
      '/api/users/info',
      '/api/users/[id]',
    ]);
  });

  it('should handle index routes correctly', () => {
    const routes = ['/api/users/[id]', '/api/users/index', '/api/users/info'];
    const sortedRoutes = sortRoutes(routes);

    expect(sortedRoutes).toEqual([
      '/api/users/info',
      '/api/users/index',
      '/api/users/[id]',
    ]);
  });
});
