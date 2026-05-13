const https = require('https');

// Vercel Serverless Function - 通义千问图像生成
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, input, size } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Missing apiKey' });
    }

    const requestData = {
      model: 'qwen-image-plus',
      input: {
        prompt: input.prompt || input
      },
      parameters: {
        size: size || '1024*1360',
        n: 1,
        prompt_extend: false
      }
    };

    const result = await makeRequest(requestData, apiKey);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
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
