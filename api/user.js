import { getUserById, verifyToken } from './lib/auth.js';

export default async function handler(req, res) {
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
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[API] User error:', error);
    return res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
}
