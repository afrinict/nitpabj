import jwt from 'jsonwebtoken';
import { User } from '../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(user: User) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
} 