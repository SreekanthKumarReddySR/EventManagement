const TASK_STATUSES = ['todo', 'in-progress', 'done'];

function isValidDateInput(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
}

function normalizeNullableText(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  return value.trim();
}

export function validateCreateTask(payload) {
  const errors = [];
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';

  if (!title) {
    errors.push('title is required and must be a non-empty string.');
  }

  if (payload.description !== undefined && payload.description !== null && typeof payload.description !== 'string') {
    errors.push('description must be a string when provided.');
  }

  if (payload.status !== undefined && !TASK_STATUSES.includes(payload.status)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }

  if (payload.dueDate !== undefined && payload.dueDate !== null && payload.dueDate !== '' && !isValidDateInput(payload.dueDate)) {
    errors.push('dueDate must be a valid date string when provided.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      title,
      description: normalizeNullableText(payload.description),
      status: payload.status || 'todo',
      dueDate: payload.dueDate ? payload.dueDate : null
    }
  };
}

export function validateUpdateTask(payload) {
  const errors = [];
  const allowedFields = ['title', 'description', 'status', 'dueDate'];
  const incomingFields = Object.keys(payload);

  if (incomingFields.length === 0) {
    errors.push('At least one updatable field is required.');
  }

  if (!incomingFields.some((field) => allowedFields.includes(field))) {
    errors.push(`Only these fields can be updated: ${allowedFields.join(', ')}.`);
  }

  if (payload.title !== undefined) {
    if (typeof payload.title !== 'string' || !payload.title.trim()) {
      errors.push('title must be a non-empty string when provided.');
    }
  }

  if (payload.description !== undefined && payload.description !== null && typeof payload.description !== 'string') {
    errors.push('description must be a string when provided.');
  }

  if (payload.status !== undefined && !TASK_STATUSES.includes(payload.status)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }

  if (payload.dueDate !== undefined && payload.dueDate !== null && payload.dueDate !== '' && !isValidDateInput(payload.dueDate)) {
    errors.push('dueDate must be a valid date string when provided.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      ...(payload.title !== undefined ? { title: payload.title.trim() } : {}),
      ...(payload.description !== undefined ? { description: normalizeNullableText(payload.description) } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.dueDate !== undefined ? { dueDate: payload.dueDate || null } : {})
    }
  };
}

export function validateTaskListQuery(query) {
  const errors = [];
  const hasPagination = query.page !== undefined || query.limit !== undefined;
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  if (query.status !== undefined && !TASK_STATUSES.includes(query.status)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }

  if (hasPagination && (!Number.isInteger(page) || page < 1)) {
    errors.push('page must be a positive integer when provided.');
  }

  if (hasPagination && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    errors.push('limit must be an integer between 1 and 100 when provided.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      status: query.status,
      hasPagination,
      page,
      limit
    }
  };
}
