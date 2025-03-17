import type { Mock } from 'vitest';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('fdir', () => {
  return {
    fdir: vi.fn().mockImplementation(() => {}),
  };
});

const { fdir } = await import('fdir');
const { comityIslands } = await import('../islands.js');

interface MockOptions {
  css?: string;
  path?: string;
  extension?: string;
}

interface Plugin {
  name: string;
  resolveId?: (id: string) => string | null;
  load?: (id: string) => string | null;
  transform?: (code: string, id: string) => { code: string } | null;
}

describe('comityIslands', () => {
  const mockOptions: MockOptions = { css: '.css' };
  let plugin: Plugin;

  beforeEach(async () => {
    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi.fn().mockReturnValue(['component.island.tsx', 'component.css']),
    }));

    plugin = comityIslands(mockOptions) as Plugin;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should have the correct name', () => {
    expect(plugin.name).toBe('@comity/vite-islands');
  });

  it('should resolve virtual module id', async () => {
    const resolvedId = await plugin.resolveId?.('virtual:comity-islands');

    expect(resolvedId).toBe('\0virtual:comity-islands?filename=');
  });

  it('should load virtual module with components', async () => {
    const code = await plugin.load?.('\0virtual:comity-islands?filename=');

    console.log('Received code', code);

    expect(code).toContain("import('~/components/component.css');");
    expect(code).toContain(
      "'component.island.tsx': () => import('~/components/component.island.tsx'),"
    );
  });

  it('should load virtual module with filename', async () => {
    const code = await plugin.load?.(
      '\0virtual:comity-islands?filename=component.island.tsx'
    );

    expect(code).toContain("export const filename = 'component.island.tsx';");
  });

  it('should handle empty components list', async () => {
    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi.fn().mockReturnValue([]),
    }));

    plugin = comityIslands(mockOptions) as Plugin;
    const code = await plugin.load?.('\0virtual:comity-islands');

    expect(code).toContain('export const components = {\n};');
  });

  it('should handle different file extensions', async () => {
    const optionsWithExtension: MockOptions = {
      css: '.css',
      extension: '.(jsx|vue)',
    };

    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi
        .fn()
        .mockReturnValue(['component.jsx', 'component.vue', 'component.css']),
    }));

    plugin = comityIslands(optionsWithExtension) as Plugin;

    const code = await plugin.load?.('\0virtual:comity-islands');

    expect(code).toContain("import('~/components/component.css');");
    expect(code).toContain(
      "'component.jsx': () => import('~/components/component.jsx'),"
    );
    expect(code).toContain(
      "'component.vue': () => import('~/components/component.vue'),"
    );
  });
});
