import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..', '..');
const workspaceRoot = path.resolve(serverRoot, '..');
const envFile = path.join(workspaceRoot, '.env');

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL === 'true',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

export function assertDatabaseConfig() {
  if (!env.databaseUrl) {
    throw new Error(
      `DATABASE_URL is missing. Add it to ${envFile}, or set it in your deployment environment before starting the server or running db:setup.`
    );
  }
}

export function assertAuthConfig() {
  if (!env.jwtSecret) {
    throw new Error(
      `JWT_SECRET is missing. Add it to ${envFile}, or set it in your deployment environment before starting the server.`
    );
  }
}
