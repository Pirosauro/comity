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
  framework: string;
  css: boolean;
}

interface Plugin {
  name: string;
  resolveId?: (id: string) => string | null;
  load?: (id: string) => string | null;
  transform?: (code: string, id: string) => { code: string } | null;
}

describe('comityIslands', () => {
  const mockOptions = { framework: 'react', css: true };
  let plugin: Plugin;

  beforeEach(async () => {
    (fdir as Mock).mockImplementation(() => ({
      withRelativePaths: vi.fn().mockReturnThis(),
      withMaxDepth: vi.fn().mockReturnThis(),
      crawl: vi.fn().mockReturnThis(),
      sync: vi.fn().mockReturnValue(['component.tsx', 'component.css']),
    }));

    plugin = comityIslands(mockOptions) as Plugin;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should have the correct name', () => {
    expect(plugin.name).toBe('@comity/vite-islands');
  });

  it('should resolve virtual module id', () => {
    const resolvedId = plugin.resolveId?.('virtual:comity-islands');

    expect(resolvedId).toBe('\0virtual:comity-islands');
  });

  it('should load virtual module with components', () => {
    const code = plugin.load?.('\0virtual:comity-islands');

    expect(code).toContain("import('~/components/component.css');");
    expect(code).toContain(
      "'1v70cgr': () => import('~/components/component.tsx'),"
    );
  });

  it('should transform code for island components', () => {
    const inputCode = 'const Component = () => {};';
    const id = '/src/components/test.island.tsx';
    const result = plugin.transform?.(inputCode, id);

    expect(result?.code).toContain(
      "Object.defineProperty(Test, 'name', { writable: false, value: 's1kdt' })"
    );
    expect(result?.code).toContain(
      "Object.defineProperty(Test, 'framework', { writable: false, value: 'react' })"
    );
  });
});
