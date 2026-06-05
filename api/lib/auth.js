import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    is_admin: Boolean(Number(user.is_admin || 0)),
  };
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function registerUser(name, email, password) {
  // Check if user exists
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('Email already exists');
  }

  // Create user
  const hashedPassword = hashPassword(password);
  const result = await query(
    'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [name, email, hashedPassword]
  );

  return {
    id: result.insertId,
    name,
    email,
    is_admin: false,
    token: generateToken(result.insertId, email),
  };
}

export async function loginUser(email, password) {
  const users = await query('SELECT id, name, email, password, is_admin FROM users WHERE email = ?', [email]);
  
  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = users[0];
  const hashedPassword = hashPassword(password);

  if (user.password !== hashedPassword) {
    throw new Error('Invalid credentials');
  }

  return {
    ...formatUser(user),
    token: generateToken(user.id, user.email),
  };
}

export async function getUserById(userId) {
  const users = await query('SELECT id, name, email, is_admin FROM users WHERE id = ?', [userId]);
  if (users.length === 0) {
    return null;
  }
  return formatUser(users[0]);
}
