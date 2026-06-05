// Test endpoint to check if API is working
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('[API] Test endpoint called');
    res.status(200).json({
      message: 'Le backend Vercel fonctionne !',
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        db_host: process.env.DB_HOST ? 'configured' : 'missing',
        node_env: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('[API] Test error:', error);
    res.status(500).json({ 
      error: error.message,
      status: 'error',
    });
  }
}
