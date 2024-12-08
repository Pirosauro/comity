import { describe, it, expect, vi } from 'vitest';
import { access } from 'node:fs/promises';
import { exists } from '../utils.js';

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
}));

describe('exists', () => {
  it('should return true if the file or directory exists', async () => {
    (access as any).mockResolvedValueOnce(undefined);

    const result = await exists('/path/to/existing/file');

    expect(result).toBe(true);
  });

  it('should return false if the file or directory does not exist', async () => {
    (access as any).mockRejectedValueOnce(new Error('File not found'));

    const result = await exists('/path/to/nonexistent/file');

    expect(result).toBe(false);
  });
});
