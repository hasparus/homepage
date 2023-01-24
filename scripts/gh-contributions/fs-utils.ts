import { readFile, writeFile } from "fs/promises";

export async function writeJson(path: string, data: unknown) {
  await writeFile(path, JSON.stringify(data, null, 2), "utf8");
}

export async function readJson(path: string) {
  const content = await readFile(path, "utf8");
  return JSON.parse(content) as unknown;
}

export function createFsCache(cachePath: string) {
  return {
    write: async (data: object) => {
      await writeJson(cachePath, data);
    },
    read: async () => {
      try {
        const content = await readJson(cachePath);
        return content;
      } catch (_err) {
        return null;
      }
    },
  };
}
