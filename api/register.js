import { registerUser } from './lib/auth.js';

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
    console.log('[API] Register request received:', req.body?.email);
    const { name, email, password, password_confirmation } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(422).json({
        errors: {
          name: name ? [] : ['Name is required'],
          email: email ? [] : ['Email is required'],
          password: password ? [] : ['Password is required'],
        },
      });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({
        errors: {
          password: ['Passwords do not match'],
        },
      });
    }

    if (password.length < 8) {
      return res.status(422).json({
        errors: {
          password: ['Password must be at least 8 characters'],
        },
      });
    }

    const user = await registerUser(name, email, password);
    console.log('[API] User registered:', user.email);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      access_token: user.token,
    });
  } catch (error) {
    console.error('[API] Register error:', error);
    res.status(400).json({
      message: error.message,
      errors: { email: [error.message] },
    });
  }
}
