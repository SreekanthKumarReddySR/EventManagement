import { apiRequest } from './client.js';

export async function fetchAdminOverview(token) {
  const payload = await apiRequest('/admin/overview', {
    method: 'GET',
    token
  });

  return payload.data;
}

export async function fetchUsers(token) {
  const payload = await apiRequest('/admin/users', {
    method: 'GET',
    token
  });

  return payload.data || [];
}
