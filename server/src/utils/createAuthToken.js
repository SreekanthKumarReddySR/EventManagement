import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function createAuthToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
}
