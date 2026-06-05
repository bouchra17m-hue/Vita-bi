import { query } from './lib/db.js';

export default async function handler(req, res) {
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
    console.log('[API] Products request');
    const products = await query('SELECT * FROM products LIMIT 100', []);
    console.log('[API] Products found:', products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error('[API] Products error:', error);
    res.status(500).json({
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
}
