import { apiRequest } from './client.js';

export async function fetchTasks(token, { status, page = 1, limit = 6 } = {}) {
  const query = new URLSearchParams();

  if (status && status !== 'all') {
    query.set('status', status);
  }

  query.set('page', String(page));
  query.set('limit', String(limit));

  const payload = await apiRequest(`/tasks?${query.toString()}`, {
    method: 'GET',
    token
  });

  return payload;
}

export async function createTask(task, token) {
  const payload = await apiRequest('/tasks', {
    method: 'POST',
    token,
    body: task
  });

  return payload.data;
}

export async function updateTask(id, updates, token) {
  const payload = await apiRequest(`/tasks/${id}`, {
    method: 'PATCH',
    token,
    body: updates
  });

  return payload.data;
}

export async function deleteTask(id, token) {
  await apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
    token
  });
}
