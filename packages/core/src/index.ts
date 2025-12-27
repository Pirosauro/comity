export async function getFilename(): Promise<string | undefined> {
  // CommonJS
  if (typeof __filename !== "undefined") {
    return __filename;
  }

  // @ts-ignore ESM
  if (typeof import.meta !== "undefined") {
    const { fileURLToPath } = await import("url");

    // @ts-ignore
    return fileURLToPath(import.meta.url);
  }
}

export async function getDirname(): Promise<string> {
  // CommonJS
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }

  // @ts-ignore ESM
  if (typeof import.meta !== "undefined") {
    const { fileURLToPath } = await import("url");
    const { dirname } = await import("path");

    // @ts-ignore
    return dirname(fileURLToPath(import.meta.url));
  }

  // Fallback
  return process.cwd();
}
