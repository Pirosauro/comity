import { describe, it, expect, vi, beforeEach } from 'vitest';
import { join } from 'node:path';
import { stat, readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { populateProject } from '../populate-project.js';
import { exists } from '../utils.js';

vi.mock('node:path', () => ({
  join: vi.fn(),
}));
vi.mock('node:fs/promises', () => ({
  stat: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));
vi.mock('../utils.js', () => ({
  exists: vi.fn(),
}));

describe('populateProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should join paths correctly', async () => {
    const templatePath = '/template/path';
    const projectName = 'my-project';
    const workingDir = '/working/dir';
    const file = 'file.txt';

    (readdir as any).mockResolvedValue([file]);
    (stat as any).mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
    });
    (readFile as any).mockResolvedValue('file content');
    (exists as any).mockResolvedValue(false);

    await populateProject(templatePath, projectName, workingDir);

    expect(join).toHaveBeenCalledWith(templatePath, file);
  });

  vi.mock('node:path', () => ({
    join: vi.fn(),
  }));
  vi.mock('node:fs/promises', () => ({
    stat: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  }));
  vi.mock('../utils.js', () => ({
    exists: vi.fn(),
  }));

  // it('should write file content correctly', async () => {
  //   const templatePath = '/template/path';
  //   const projectName = 'my-project';
  //   const workingDir = '/working/dir';
  //   const file = 'file.txt';

  //   (readdir as any).mockResolvedValue([file]);
  //   (stat as any).mockResolvedValue({
  //     isFile: () => true,
  //     isDirectory: () => false,
  //   });
  //   (readFile as any).mockResolvedValue('file content');
  //   (exists as any).mockResolvedValue(false);

  //   await populateProject(templatePath, projectName, workingDir);

  //   const writePath = join(workingDir, projectName, file);

  //   expect(writeFile).toHaveBeenCalledWith(
  //     writePath,
  //     expect.any(String),
  //     'utf8'
  //   );
  // });

  // it('should create directories correctly', async () => {
  //   const templatePath = '/template/path';
  //   const projectName = 'my-project';
  //   const workingDir = '/working/dir';
  //   const dir = 'dir';

  //   (readdir as any).mockResolvedValue([dir]);
  //   (stat as any).mockResolvedValue({
  //     isFile: () => false,
  //     isDirectory: () => true,
  //   });
  //   (exists as any).mockResolvedValue(false);

  //   await populateProject(templatePath, projectName, workingDir);

  //   const targetPath = join(workingDir, projectName, dir);

  //   expect(mkdir).toHaveBeenCalledWith(targetPath);
  // });

  it('should skip files in skipFiles array', async () => {
    const templatePath = '/template/path';
    const projectName = 'my-project';
    const workingDir = '/working/dir';
    const skipFile = 'node_modules';

    (readdir as any).mockResolvedValue([skipFile]);
    (stat as any).mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
    });

    await populateProject(templatePath, projectName, workingDir);

    expect(readFile).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });
});
