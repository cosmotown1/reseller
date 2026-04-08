import fs from 'fs/promises';
import path from 'path';

export async function getApiFolders(rootDir) {
  const level1 = await fs.readdir(rootDir, { withFileTypes: true });

  const apiFolders = [];

  for (const dir1 of level1) {
    if (!dir1.isDirectory()) continue;

    const dir1Path = path.join(rootDir, dir1.name);

    const level2 = await fs.readdir(dir1Path, { withFileTypes: true });

    for (const dir2 of level2) {
      if (!dir2.isDirectory()) continue;

      const apiDir = path.join(dir1Path, dir2.name);

      apiFolders.push(apiDir);
    }
  }

  return apiFolders;
}

export async function getCaseFolders(apiDir) {
  const entries = await fs.readdir(apiDir, { withFileTypes: true });

  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(apiDir, e.name));
}

export async function getRequestFiles(caseDir) {
  const files = await fs.readdir(caseDir);

  return files
    .filter(
      (f) =>
        f.endsWith('.json') &&
        !f.endsWith('.response.json')
    )
    .map((f) => path.join(caseDir, f));
}