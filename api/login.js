import { loginUser } from './lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        errors: {
          email: email ? [] : ['Email is required'],
          password: password ? [] : ['Password is required'],
        },
      });
    }

    const user = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      user,
      access_token: user.token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      message: error.message,
      errors: { email: [error.message] },
    });
  }
}
