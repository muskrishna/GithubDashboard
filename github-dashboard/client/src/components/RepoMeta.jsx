import { formatNumber, timeAgo } from '../lib/format.js';

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z" /></svg>
);
const Fork = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v2a3 3 0 003 3h6a3 3 0 003-3V7M12 12v5" /></svg>
);

export default function RepoMeta({ repo }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted">
      {repo.language && <span>{repo.language}</span>}
      <span className="flex items-center gap-1" title="Stars"><Star />{formatNumber(repo.stars)}</span>
      <span className="flex items-center gap-1" title="Forks"><Fork />{formatNumber(repo.forks)}</span>
      {repo.updatedAt && <span>Updated {timeAgo(repo.updatedAt)}</span>}
    </div>
  );
}
