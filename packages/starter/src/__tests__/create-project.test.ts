import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mkdir } from 'node:fs/promises';
import { createProject } from '../create-project.js';

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
}));

describe('createProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new project when isUpdate is false', async () => {
    const targetPath = '/path/to/project';
    const isUpdate = false;

    await createProject(targetPath, isUpdate);

    expect(mkdir).toHaveBeenCalledWith(targetPath);
  });

  it('should not create a new project when isUpdate is true', async () => {
    const targetPath = '/path/to/project';
    const isUpdate = true;

    await createProject(targetPath, isUpdate);

    expect(mkdir).not.toHaveBeenCalled();
  });

  it('should log the correct message when creating a project', async () => {
    const targetPath = '/path/to/project';
    const isUpdate = false;
    const consoleSpy = vi.spyOn(console, 'log');

    await createProject(targetPath, isUpdate);

    expect(consoleSpy).toHaveBeenCalledWith(
      '\u001B[33mCreating project…\u001B[0m'
    );
  });

  it('should log the correct message when updating a project', async () => {
    const targetPath = '/path/to/project';
    const isUpdate = true;
    const consoleSpy = vi.spyOn(console, 'log');

    await createProject(targetPath, isUpdate);

    expect(consoleSpy).toHaveBeenCalledWith(
      '\u001B[33mUpdating project…\u001B[0m'
    );
  });
});
