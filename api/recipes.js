import https from 'https';
import http from 'http';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          data: data,
          headers: response.headers
        });
      });
    }).on('error', reject);
  });
}

export default async function handler(req, res) {
  const BACKEND_URL = 'https://vitabi-backend.boushera-bai.alwaysdata.net';
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Proxy to the backend API
    const response = await makeRequest(`${BACKEND_URL}/api/recipes`);

    if (response.status !== 200) {
      return res.status(response.status).json({ 
        error: `Failed to fetch recipes: ${response.status}` 
      });
    }

    const data = JSON.parse(response.data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Recipes proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch recipes',
      message: error.message 
    });
  }
}
