import { Router } from 'express';
import { ghGet, mapRepo } from '../github.js';
import { getCache, setCache } from '../utils/cache.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();
const FIVE_MINUTES = 5 * 60 * 1000;
const PER_PAGE = 10;
const GITHUB_MAX_RESULTS = 1000; 


router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) throw new ApiError(400, 'Enter a keyword to search.');
    if (q.length > 256) throw new ApiError(400, 'Search is too long.');

    const sort = req.query.sort === 'updated' ? 'updated' : 'stars';
    const page = Math.min(Math.max(parseInt(req.query.page, 10) || 1, 1), GITHUB_MAX_RESULTS / PER_PAGE);

    const key = `search:${q.toLowerCase()}|${sort}|${page}`;
    const cached = getCache(key);
    if (cached) return res.json({ ...cached, cached: true });

    const data = await ghGet('/search/repositories', { q, sort, order: 'desc', page, per_page: PER_PAGE });
    const total = data.total_count;
    const result = {
      items: data.items.map(mapRepo),
      total,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil(Math.min(total, GITHUB_MAX_RESULTS) / PER_PAGE),
    };
    setCache(key, result, FIVE_MINUTES);
    res.json({ ...result, cached: false });
  } catch (err) {
    next(err);
  }
});

const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/;


router.get('/:owner/:repo', async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    if (!NAME_RE.test(owner) || !NAME_RE.test(repo)) throw new ApiError(400, 'Invalid repository name.');

    
    const repoData = await ghGet(`/repos/${owner}/${repo}`);

    
    const [commits, contributors] = await Promise.allSettled([
      ghGet(`/repos/${owner}/${repo}/commits`, { per_page: 5 }),
      ghGet(`/repos/${owner}/${repo}/contributors`, { per_page: 5 }),
    ]);

    
    for (const r of [commits, contributors]) {
      if (r.status === 'rejected' && r.reason.status === 429) throw r.reason;
    }

    const warnings = [];
    const commitList =
      commits.status === 'fulfilled'
        ? commits.value.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split('\n')[0],
            author: c.author?.login || c.commit.author?.name || 'Unknown',
            date: c.commit.author?.date,
            url: c.html_url,
          }))
        : (warnings.push('Commits could not be loaded.'), []);

    const contributorList =
      contributors.status === 'fulfilled' && Array.isArray(contributors.value)
        ? contributors.value.map((c) => ({
            login: c.login,
            avatarUrl: c.avatar_url,
            contributions: c.contributions,
            url: c.html_url,
          }))
        : (warnings.push('Contributors could not be loaded.'), []);

    res.json({ repo: mapRepo(repoData), commits: commitList, contributors: contributorList, warnings });
  } catch (err) {
    next(err);
  }
});

export default router;
