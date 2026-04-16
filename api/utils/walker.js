import fs from 'fs/promises';
import path from 'path';

export async function getApiFolders(rootDir) {
  const results = [];

  async function recurse(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    let hasApiConfig = false;

    for (const entry of entries) {
      if (entry.isFile() && entry.name === 'api_config.json') {
        hasApiConfig = true;
        break;
      }
    }

    if (hasApiConfig) {
      results.push(currentDir);
      return; // stop going deeper inside this API folder
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await recurse(path.join(currentDir, entry.name));
      }
    }
  }

  await recurse(rootDir);

  return results;
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