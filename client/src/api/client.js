const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function normalizeBaseUrl(baseUrl) {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//.test(assetPath)) {
    return assetPath;
  }

  const baseUrl = normalizeBaseUrl(API_BASE_URL);
  return baseUrl ? `${baseUrl}${assetPath}` : assetPath;
}

export async function apiRequest(path, options = {}) {
  const { token, headers, body, ...restOptions } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestHeaders = {
    ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: requestHeaders,
    ...(body !== undefined
      ? { body: isFormData ? body : JSON.stringify(body) }
      : {})
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}
