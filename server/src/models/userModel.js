import { query } from '../config/db.js';

export async function createUser({ name, email, passwordHash, role }) {
  const result = await query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, avatar_url, created_at, updated_at
    `,
    [name, email, passwordHash, role]
  );

  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await query(
    `
      SELECT id, name, email, role, avatar_url, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await query(
    `
      SELECT id, name, email, role, avatar_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export async function updateUserAvatar(id, avatarUrl) {
  const result = await query(
    `
      UPDATE users
      SET avatar_url = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, role, avatar_url, created_at, updated_at
    `,
    [avatarUrl, id]
  );

  return result.rows[0] || null;
}

export async function getAllUsersWithTaskCounts() {
  const result = await query(
    `
      SELECT
        users.id,
        users.name,
        users.email,
        users.role,
        users.avatar_url,
        users.created_at,
        users.updated_at,
        COUNT(tasks.id)::int AS task_count
      FROM users
      LEFT JOIN tasks ON tasks.user_id = users.id
      GROUP BY users.id
      ORDER BY users.created_at DESC
    `
  );

  return result.rows;
}
