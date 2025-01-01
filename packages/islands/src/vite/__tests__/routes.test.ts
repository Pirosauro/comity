import type { Mock } from 'vitest';
import { resolve } from 'node:path';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('fdir', () => {
  return {
    fdir: vi.fn().mockImplementation(() => {}),
  };
});

const { fdir } = await import('fdir');
const { getRoutes, comityRoutes } = await import('../routes.js');

describe('getRoutes', () => {
  let consoleLog: typeof console.log;

  beforeEach(() => {
    consoleLog = console.log;
    console.log = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();

    console.log = consoleLog;
  });

  it('should group and sort files correctly', () => {
    const mockFiles = [
      'folder2/file2.get.ts',
      'folder2/file2.post.ts',
      'folder1/file1.ts',
      'folder1/file2.ts',
      'folder2/file1.ts',
      'folder2/file2.ts',
      'folder2/subfolder/file3.ts',
      'folder3/[param].ts',
      'folder3/index.ts',
    ];

    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi.fn().mockReturnValue(mockFiles),
    }));

    const result = getRoutes('some/path');

    expect(result).toEqual([
      '/folder2/subfolder/file3.ts',
      '/folder1/file1.ts',
      '/folder1/file2.ts',
      '/folder2/file2.post.ts',
      '/folder2/file2.get.ts',
      '/folder2/file1.ts',
      '/folder2/file2.ts',
      '/folder3/index.ts',
      '/folder3/[param].ts',
    ]);
  });

  it('should handle empty directories', () => {
    const mockFiles = [];

    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi.fn().mockReturnValue(mockFiles),
    }));

    const result = getRoutes('some/path');

    expect(result).toEqual([]);
  });
});

describe('comityRoutes', () => {
  let consoleLog: typeof console.log;

  beforeEach(() => {
    consoleLog = console.log;
    console.log = vi.fn();

    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi
        .fn()
        .mockReturnValue(['index.get.ts', 'about.get.ts', 'blog/[id].get.ts']),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();

    console.log = consoleLog;
  });

  it('should return a Vite plugin with the correct name', () => {
    const plugin = comityRoutes();

    expect(plugin.name).toBe('@comity/vite-routes');
  });

  it('should resolve virtual module id correctly', () => {
    const plugin = comityRoutes() as any;
    const resolved = plugin.resolveId('virtual:comity-routes/about.ts');

    expect(resolved).toEqual({
      id: resolve('./src/views/about.ts'),
      external: false,
      moduleSideEffects: true,
    });
  });

  it('should load the virtual module correctly', async () => {
    const plugin = comityRoutes() as any;
    const code = await plugin.load('\0virtual:comity-routes');

    expect(code).toContain(
      "import r0 from 'virtual:comity-routes/blog/[id].get.ts'"
    );
    expect(code).toContain(
      "import r1 from 'virtual:comity-routes/about.get.ts'"
    );
    expect(code).toContain(
      "import r2 from 'virtual:comity-routes/index.get.ts'"
    );
    expect(code).toContain("'/blog/[id].get': r0,");
    expect(code).toContain("'/about.get': r1,");
    expect(code).toContain("'/index.get': r2,");
  });

  it('should register the correct number of routes', () => {
    comityRoutes();

    expect(console.log).toHaveBeenCalledWith(
      '\u001B[34m3 routes found\u001B[0m'
    );
  });
});
