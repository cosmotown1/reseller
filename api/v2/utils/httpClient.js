import axios from 'axios';

export function createClient(globalConfig) {
  return axios.create({
    baseURL: globalConfig.baseUrl,
    timeout: globalConfig.timeout,
    headers: globalConfig.headers
  });
}

export async function executeRequest(client, apiConfig, requestData) {
  const start = Date.now();

  try {
    const response = await client.request({
      method: apiConfig.method,
      url: apiConfig.url,
      headers: requestData.headers || {},
      data: requestData.payload || {}
    });

    return {
      success: true,
      status: response.status,
      headers: response.headers,
      body: response.data,
      duration_ms: Date.now() - start
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        headers: error.response.headers,
        body: error.response.data,
        duration_ms: Date.now() - start
      };
    }

    return {
      success: false,
      error: error.message,
      duration_ms: Date.now() - start
    };
  }
}