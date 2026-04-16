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

// Sleep helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Polling logic
async function pollJob(client, apiConfig, jobId) {
  const asyncConfig = apiConfig.async;

  if (!asyncConfig || !asyncConfig.jobStatusUrl) {
    throw new Error('Missing async config in api_config.json');
  }

  const {
    jobStatusUrl,
    pollInterval = 2000,
    maxAttempts = 10
  } = asyncConfig;

  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const url = jobStatusUrl.replace('{{jobId}}', jobId);

    const start = Date.now();

    try {
      const response = await client.get(url);

      const duration = Date.now() - start;

      const data = response.data;

      if (data.state === 'completed') {
        return {
          success: true,
          attempts,
          duration_ms: duration,
          data
        };
      }

      if (data.state === 'failed') {
        return {
          success: false,
          attempts,
          duration_ms: duration,
          data
        };
      }

    } catch (err) {
      return {
        success: false,
        attempts,
        error: err.message
      };
    }

    await sleep(pollInterval);
  }

  return {
    success: false,
    attempts,
    error: 'Polling timeout exceeded'
  };
}


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
              console.log(`     ${path.basename(reqFile)}`);

              const requestData = await readJSON(reqFile);

               const isSync = requestData?.payload?.sync === true;

              const initialResponse  = await executeRequest(
                client,
                apiConfig,
                requestData
              );

              let finalResponse = null;
              let attempts = 0;

            if (!isSync) {

              //  If initial request itself failed → skip polling
              if (!initialResponse.success) {
                console.log(`       Skipping polling (initial request failed)`);
              } else {

                const jobId = initialResponse?.body?.data?.jobId;

                console.log(
                  `       initialResponse: ${JSON.stringify(initialResponse.body)}`
                );

                if (!jobId) {
                  console.log(`       No jobId found → skipping polling`);
                } else {
                  const pollResult = await pollJob(
                    client,
                    apiConfig,
                    jobId
                  );

                  finalResponse = pollResult;
                  attempts = pollResult.attempts;
                }
              }
            }

              const output = {
                request: requestData,
                initialResponse,
                finalResponse,
                meta: {
                  fullPath: apiDir,
                  case: caseName,
                   flow: isSync ? 'sync' : 'async',
                  attempts,
                  timestamp: new Date().toISOString()
                }
              };

              const responseFile = reqFile.replace(
                '.json',
                '.response.json'
              );

              await writeJSON(responseFile, output);

               console.log(
                `     Done (${isSync ? 'sync' : 'async'})`
              );
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