import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRepo } from '../lib/api.js';
import { formatNumber, timeAgo } from '../lib/format.js';
import RepoMeta from '../components/RepoMeta.jsx';
import SaveButton from '../components/SaveButton.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Banner from '../components/Banner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Tile = ({ label, value }) => (
  <div className="card min-w-[140px] flex-1 px-5 py-4">
    <div className="text-[13px] text-muted">{label}</div>
    <div className="mt-1 text-[26px] font-bold">{formatNumber(value)}</div>
  </div>
);

export default function Details() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setState({ status: 'loading', data: null, error: null });
    getRepo(owner, repo)
      .then((data) => !ignore && setState({ status: 'done', data, error: null }))
      .catch((error) => !ignore && setState({ status: 'error', data: null, error }));
    return () => { ignore = true; };
  }, [owner, repo, attempt]);

  const back = <button onClick={() => navigate(-1)} className="text-sm text-brand hover:underline">← Back</button>;
  const { status, data, error } = state;

  if (status === 'loading') {
    return <div className="space-y-4" aria-busy="true">{back}<div className="card h-40 animate-pulse" /><div className="card h-64 animate-pulse" /></div>;
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        {back}
        {error.status === 404 ? (
          <EmptyState title="Repository not found">
            {error.message} <Link className="text-brand underline" to="/">Back to search</Link>
          </EmptyState>
        ) : (
          <ErrorBanner error={error} onRetry={() => setAttempt((a) => a + 1)} />
        )}
      </div>
    );
  }

  const { repo: r, commits, contributors, warnings } = data;
  const maxContrib = Math.max(1, ...contributors.map((c) => c.contributions));

  return (
    <div className="space-y-5">
      {back}

      <section className="card flex flex-wrap justify-between gap-6 p-6">
        <div className="min-w-[280px] flex-1 space-y-3">
          <h1 className="text-[26px] font-bold tracking-tight">{r.fullName}</h1>
          <p className="leading-relaxed text-slate-700">{r.description || 'No description provided.'}</p>
          {r.topics.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {r.topics.map((t) => <li key={t} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-dark">{t}</li>)}
            </ul>
          )}
          <RepoMeta repo={r} />
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <SaveButton repo={r} label="Save to favourites" />
          <a className="btn-outline" href={r.url} target="_blank" rel="noreferrer">View on GitHub</a>
        </div>
      </section>

      {warnings.map((w) => <Banner key={w} variant="warning">{w}</Banner>)}

      <div className="flex flex-wrap gap-4">
        <Tile label="Stars" value={r.stars} />
        <Tile label="Forks" value={r.forks} />
        <Tile label="Open issues" value={r.openIssues} />
        <Tile label="Watchers" value={r.watchers} />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <section className="card min-w-[340px] flex-[3] px-6 py-5">
          <h2 className="mb-2 text-[17px] font-semibold">Latest 5 commits</h2>
          {commits.length === 0 ? (
            <p className="border-t border-slate-100 py-4 text-sm text-muted">No commits to show.</p>
          ) : (
            <ul>
              {commits.map((c) => (
                <li key={c.sha} className="flex justify-between gap-3 border-t border-slate-100 py-3.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.message}</div>
                    <div className="mt-0.5 text-[13px] text-muted">{c.author}, {timeAgo(c.date)}</div>
                  </div>
                  <a href={c.url} target="_blank" rel="noreferrer" className="self-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-muted hover:text-ink">{c.sha}</a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card min-w-[300px] flex-[2] px-6 py-5">
          <h2 className="mb-2 text-[17px] font-semibold">Top 5 contributors</h2>
          {contributors.length === 0 ? (
            <p className="border-t border-slate-100 py-4 text-sm text-muted">No contributors to show.</p>
          ) : (
            <ul>
              {contributors.map((c) => (
                <li key={c.login} className="flex items-center gap-3 border-t border-slate-100 py-3">
                  <img src={c.avatarUrl} alt="" width="36" height="36" className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-medium">
                      <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline">{c.login}</a>
                      <span className="font-normal text-muted">{c.contributions.toLocaleString()} commits</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded bg-slate-100">
                      <div className="h-1.5 rounded bg-brand" style={{ width: `${(c.contributions / maxContrib) * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
