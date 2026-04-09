import { query } from '../config/db.js';

function buildTaskConditions({ status, user }) {
  const values = [];
  const conditions = [];

  if (user.role !== 'admin') {
    values.push(user.id);
    conditions.push(`user_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  return {
    values,
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  };
}

export async function getAllTasks({ status, hasPagination, page, limit, user }) {
  const { values, whereClause } = buildTaskConditions({ status, user });

  const countResult = await query(
    `SELECT COUNT(*)::int AS count FROM tasks ${whereClause}`,
    values
  );

  const totalCount = countResult.rows[0]?.count ?? 0;
  const selectValues = [...values];
  let selectQuery = `
    SELECT id, user_id, title, description, status, due_date, created_at, updated_at
    FROM tasks
    ${whereClause}
    ORDER BY created_at DESC
  `;

  if (hasPagination) {
    const offset = (page - 1) * limit;
    selectValues.push(limit);
    const limitPlaceholder = `$${selectValues.length}`;
    selectValues.push(offset);
    const offsetPlaceholder = `$${selectValues.length}`;
    selectQuery += ` LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`;
  }

  const result = await query(selectQuery, selectValues);
  return { tasks: result.rows, totalCount };
}

export async function getTaskById(id, user) {
  const values = [id];
  let accessClause = '';

  if (user.role !== 'admin') {
    values.push(user.id);
    accessClause = `AND user_id = $${values.length}`;
  }

  const result = await query(
    `
      SELECT id, user_id, title, description, status, due_date, created_at, updated_at
      FROM tasks
      WHERE id = $1 ${accessClause}
    `,
    values
  );

  return result.rows[0] || null;
}

export async function createTask({ title, description, status, dueDate, userId }) {
  const result = await query(
    `
      INSERT INTO tasks (user_id, title, description, status, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, title, description, status, due_date, created_at, updated_at
    `,
    [userId, title, description, status, dueDate]
  );

  return result.rows[0];
}

export async function updateTask(id, updates, user) {
  const setClauses = [];
  const values = [];

  if (updates.title !== undefined) {
    values.push(updates.title);
    setClauses.push(`title = $${values.length}`);
  }

  if (updates.description !== undefined) {
    values.push(updates.description);
    setClauses.push(`description = $${values.length}`);
  }

  if (updates.status !== undefined) {
    values.push(updates.status);
    setClauses.push(`status = $${values.length}`);
  }

  if (updates.dueDate !== undefined) {
    values.push(updates.dueDate);
    setClauses.push(`due_date = $${values.length}`);
  }

  values.push(id);
  let userClause = '';

  if (user.role !== 'admin') {
    values.push(user.id);
    userClause = `AND user_id = $${values.length}`;
  }

  const result = await query(
    `
      UPDATE tasks
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE id = $${user.role === 'admin' ? values.length : values.length - 1} ${userClause}
      RETURNING id, user_id, title, description, status, due_date, created_at, updated_at
    `,
    values
  );

  return result.rows[0] || null;
}

export async function deleteTask(id, user) {
  const values = [id];
  let userClause = '';

  if (user.role !== 'admin') {
    values.push(user.id);
    userClause = `AND user_id = $${values.length}`;
  }

  const result = await query(
    `DELETE FROM tasks WHERE id = $1 ${userClause}`,
    values
  );

  return result.rowCount > 0;
}
