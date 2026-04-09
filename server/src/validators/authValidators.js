const ALLOWED_ROLES = ['member', 'admin'];

function isValidEmail(email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email.trim());
}

export function validateSignup(payload) {
  const errors = [];
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const role = payload.role || 'member';

  if (!name) {
    errors.push('name is required and must be a non-empty string.');
  }

  if (!isValidEmail(email)) {
    errors.push('email must be a valid email address.');
  }

  if (password.length < 6) {
    errors.push('password must be at least 6 characters long.');
  }

  if (!ALLOWED_ROLES.includes(role)) {
    errors.push(`role must be one of: ${ALLOWED_ROLES.join(', ')}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { name, email, password, role }
  };
}

export function validateLogin(payload) {
  const errors = [];
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!isValidEmail(email)) {
    errors.push('email must be a valid email address.');
  }

  if (!password) {
    errors.push('password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { email, password }
  };
}
