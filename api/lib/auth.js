import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

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
    token: generateToken(result.insertId, email),
  };
}

export async function loginUser(email, password) {
  const users = await query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
  
  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = users[0];
  const hashedPassword = hashPassword(password);

  if (user.password !== hashedPassword) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id, user.email),
  };
}

export async function getUserById(userId) {
  const users = await query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
  if (users.length === 0) {
    return null;
  }
  return users[0];
}
