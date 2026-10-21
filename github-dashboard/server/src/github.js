import axios from 'axios';
import { ApiError } from './utils/ApiError.js';

const token = process.env.GITHUB_TOKEN;

const client = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

//to kown waht error came
function toApiError(err) {
  if (!err.response) {
    return new ApiError(502, 'Could not reach GitHub. Please try again shortly.');
  }
  const { status, headers, data } = err.response;

  const limited =
    (status === 403 || status === 429) &&
    (headers['x-ratelimit-remaining'] === '0' || headers['retry-after']);
  if (limited) {
    const reset = Number(headers['x-ratelimit-reset']);
    const retryAfter = headers['retry-after']
      ? Number(headers['retry-after'])
      : reset
        ? Math.max(1, reset - Math.floor(Date.now() / 1000))
        : 60;
    return new ApiError(429, 'GitHub rate limit reached.', { retryAfter });
  }
  if (status === 404) return new ApiError(404, 'Repository not found. It may have been deleted, renamed or made private.');
  if (status === 422) return new ApiError(400, 'GitHub could not process that search. Try different keywords.');
  if (status === 401) return new ApiError(502, 'The GitHub token on the server is invalid.');
  if (status >= 500) return new ApiError(502, 'GitHub is unavailable right now. Please try again shortly.');
  return new ApiError(status, data?.message || 'GitHub request failed.');
}

export async function ghGet(path, params) {
  try {
    const res = await client.get(path, { params });
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
}


export function mapRepo(r) {
  return {
    githubId: r.id,
    fullName: r.full_name,
    owner: r.owner?.login,
    name: r.name,
    description: r.description || '',
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || null,
    updatedAt: r.updated_at,
    url: r.html_url,
    openIssues: r.open_issues_count,
    watchers: r.subscribers_count ?? r.watchers_count,
    topics: r.topics || [],
  };
}
