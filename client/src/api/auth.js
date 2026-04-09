import { apiRequest } from './client.js';

export async function loginUser(credentials) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  });

  return payload.data;
}

export async function signupUser(userDetails) {
  const payload = await apiRequest('/auth/signup', {
    method: 'POST',
    body: userDetails
  });

  return payload.data;
}

export async function fetchCurrentUser(token) {
  const payload = await apiRequest('/auth/me', {
    method: 'GET',
    token
  });

  return payload.data;
}

export async function uploadProfilePhoto(token, file) {
  const formData = new FormData();
  formData.append('photo', file);

  const payload = await apiRequest('/auth/me/avatar', {
    method: 'PATCH',
    token,
    body: formData
  });

  return payload.data;
}
