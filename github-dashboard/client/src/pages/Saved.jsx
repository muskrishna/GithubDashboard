import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import RepoCard from '../components/RepoCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

export default function Saved() {
  const { favorites, loading, loadError, remove, reload } = useFavorites();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-bold tracking-tight">Saved repositories</h1>
        <span className="text-sm text-muted">{favorites.length} saved</span>
      </div>

      {loadError && <ErrorBanner error={{ status: 0, message: loadError }} onRetry={reload} />}

      {loading && <div className="card h-[116px] animate-pulse" aria-busy="true" />}

      {!loading && !loadError && favorites.length === 0 && (
        <EmptyState title="No saved repositories yet">
          Save a repository from the search results to see it here. <Link className="text-brand underline" to="/">Go to search</Link>
        </EmptyState>
      )}

      <div className="space-y-3">
        {favorites.map((repo) => (
          <RepoCard
            key={repo.githubId}
            repo={repo}
            action={<button className="btn-danger" onClick={() => remove(repo.githubId)}>Remove</button>}
          />
        ))}
      </div>
    </div>
  );
}
