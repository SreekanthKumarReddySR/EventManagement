import { Pool } from 'pg';
import { assertDatabaseConfig, env } from './env.js';

assertDatabaseConfig();

const ssl = env.databaseSsl ? { rejectUnauthorized: false } : undefined;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl
});

export async function query(text, params = []) {
  return pool.query(text, params);
}
