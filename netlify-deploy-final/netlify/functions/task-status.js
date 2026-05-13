const https = require('https');

// 通义千问 - 查询任务状态
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 从 query string 获取 taskId 和 apiKey
    const taskId = event.queryStringParameters?.taskId;
    const apiKey = event.queryStringParameters?.key;
    
    if (!taskId || !apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing taskId or apiKey' })
      };
    }

    const result = await makeRequest(taskId, apiKey);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function makeRequest(taskId, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: `/api/v1/tasks/${taskId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
