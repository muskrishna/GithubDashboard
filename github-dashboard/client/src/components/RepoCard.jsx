import { Link } from 'react-router-dom';
import RepoMeta from './RepoMeta.jsx';

export default function RepoCard({ repo, action }) {
  return (
    <article className="card flex flex-wrap items-center justify-between gap-6 p-5">
      <div className="min-w-[260px] flex-1 space-y-2">
        <Link to={`/repo/${repo.owner}/${repo.name}`} className="text-[17px] font-semibold text-brand hover:underline">
          {repo.fullName}
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-700">
          {repo.description || 'No description provided.'}
        </p>
        <RepoMeta repo={repo} />
      </div>
      {action}
    </article>
  );
}
