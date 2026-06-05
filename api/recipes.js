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
    const recipes = await query('SELECT * FROM recipes LIMIT 100', []);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Recipes error:', error);
    // Return empty array if table doesn't exist
    res.status(200).json([]);
  }
}
