import path from 'path';
import pLimit from 'p-limit';
import { fileURLToPath } from 'url';

import { readJSON, writeJSON } from './utils/fileReader.js';
import {
  getApiFolders,
  getCaseFolders,
  getRequestFiles
} from './utils/walker.js';
import { createClient, executeRequest } from './utils/httpClient.js';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname;
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');

async function run() {
  console.log(' API Test Runner Started\n');

  const globalConfig = await readJSON(CONFIG_PATH);
  const client = createClient(globalConfig);

  const apiFolders = await getApiFolders(ROOT_DIR);

  const limit = pLimit(globalConfig.concurrency || 3);

  let total = 0;

  const tasks = [];

  for (const apiDir of apiFolders) {
    const apiConfigPath = path.join(apiDir, 'api_config.json');

    let apiConfig;

    try {
      apiConfig = await readJSON(apiConfigPath);
    } catch {
      // skip folders without api_config.json
      continue;
    }

    console.log(`\n API: ${apiConfig.name}`);

    const caseFolders = await getCaseFolders(apiDir);

    for (const caseDir of caseFolders) {
      const caseName = path.basename(caseDir);

      const requestFiles = await getRequestFiles(caseDir);

      if (requestFiles.length === 0) continue;

      console.log(`   Case: ${caseName}`);

      for (const reqFile of requestFiles) {
        total++;

        tasks.push(
          limit(async () => {
            try {
              console.log(`    ➡️ ${path.basename(reqFile)}`);

              const requestData = await readJSON(reqFile);

              const response = await executeRequest(
                client,
                apiConfig,
                requestData
              );

              const responseFile = reqFile.replace(
                '.json',
                '.response.json'
              );

              const output = {
                request: requestData,
                response,
                meta: {
                  api: apiConfig.name,
                  case: caseName,
                  timestamp: new Date().toISOString()
                }
              };

              await writeJSON(responseFile, output);

              console.log(`     Done`);
            } catch (err) {
              console.error(`     Failed: ${reqFile}`);
              console.error(`       ${err.message}`);
            }
          })
        );
      }
    }
  }

  await Promise.all(tasks);

  console.log(`\n Completed ${total} requests\n`);
}

run().catch((err) => {
  console.error('Fatal Error:', err);
});