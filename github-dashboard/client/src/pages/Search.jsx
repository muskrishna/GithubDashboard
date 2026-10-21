import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRepos } from '../lib/api.js';
import RepoCard from '../components/RepoCard.jsx';
import SaveButton from '../components/SaveButton.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Search() {
  
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sort = params.get('sort') === 'updated' ? 'updated' : 'stars';
  const page = Math.max(parseInt(params.get('page'), 10) || 1, 1);

  const [text, setText] = useState(q);
  const [state, setState] = useState({ status: 'idle', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => setText(q), [q]);

  useEffect(() => {
    if (!q) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }
    let ignore = false;
    setState((s) => ({ ...s, status: 'loading', error: null }));
    searchRepos({ q, sort, page })
      .then((data) => !ignore && setState({ status: 'done', data, error: null }))
      .catch((error) => !ignore && setState({ status: 'error', data: null, error }));
    return () => { ignore = true; };
  }, [q, sort, page, attempt]);

  const update = (next) => setParams({ q, sort, page: 1, ...next });

  function onSubmit(e) {
    e.preventDefault();
    if (text.trim()) update({ q: text.trim(), page: 1 });
  }

  const { status, data, error } = state;

  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-bold tracking-tight">Search GitHub repositories</h1>

      <form onSubmit={onSubmit} className="flex flex-wrap gap-3">
        <label className="flex min-w-[260px] flex-1">
          <span className="sr-only">Search repositories</span>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search public repositories, e.g. react"
            className="min-h-[48px] flex-1 rounded-[10px] border border-slate-300 bg-white px-4 text-[15px]"
          />
        </label>
        <label>
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value, page: 1 })}
            className="min-h-[48px] rounded-[10px] border border-slate-300 bg-white px-3.5 text-sm font-medium"
          >
            <option value="stars">Most stars</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
        <button className="btn-primary min-h-[48px] px-6 text-[15px]" type="submit">Search</button>
      </form>

      {status === 'error' && <ErrorBanner error={error} onRetry={() => setAttempt((a) => a + 1)} />}

      {status === 'idle' && (
        <EmptyState title="Find a repository">Type a keyword above to search public repositories on GitHub.</EmptyState>
      )}

      {status === 'loading' && (
        <div className="space-y-3" aria-busy="true" aria-label="Loading results">
          {[0, 1, 2].map((i) => <div key={i} className="card h-[116px] animate-pulse" />)}
        </div>
      )}

      {status === 'done' && data.items.length === 0 && (
        <EmptyState title="No repositories found">Nothing matched “{q}”. Try a different keyword or check the spelling.</EmptyState>
      )}

      {status === 'done' && data.items.length > 0 && (
        <>
          <p className="text-sm text-muted">
            Showing {(data.page - 1) * data.perPage + 1}–{(data.page - 1) * data.perPage + data.items.length} of {data.total.toLocaleString()} results for “{q}”
          </p>
          <div className="space-y-3">
            {data.items.map((repo) => (
              <RepoCard key={repo.githubId} repo={repo} action={<SaveButton repo={repo} />} />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={(p) => { update({ page: p }); window.scrollTo({ top: 0 }); }} />
        </>
      )}
    </div>
  );
}
