const https = require('https');

// 通义千问图像生成 - 提交任务
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { apiKey, input, size } = JSON.parse(event.body);
    
    const requestData = {
      model: 'qwen-image-plus',
      input: {
        prompt: input.prompt || input
      },
      parameters: {
        size: size || '1024*1024',
        n: 1,
        prompt_extend: false
      }
    };

    const result = await makeRequest(requestData, apiKey);
    
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

function makeRequest(data, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: '/api/v1/services/aigc/text2image/image-synthesis',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error('Invalid JSON response: ' + responseBody));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(body);
    req.end();
  });
}
