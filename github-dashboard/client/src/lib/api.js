// The only place the frontend talks to the backend.
const BASE = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  constructor(status, message, retryAfter) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // fetch only throws when the network or our server is unreachable
    throw new ApiError(0, 'Cannot reach the server. Check that the backend is running.');
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const e = body?.error;
    throw new ApiError(res.status, e?.message || 'Request failed.', e?.retryAfter);
  }
  return body;
}

export const searchRepos = ({ q, sort, page }) =>
  request(`/api/repos/search?${new URLSearchParams({ q, sort, page })}`);

export const getRepo = (owner, repo) =>
  request(`/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);

export const getFavorites = () => request('/api/favorites');

export const addFavorite = (repo) =>
  request('/api/favorites', { method: 'POST', body: JSON.stringify(repo) });

export const removeFavorite = (githubId) =>
  request(`/api/favorites/${githubId}`, { method: 'DELETE' });
