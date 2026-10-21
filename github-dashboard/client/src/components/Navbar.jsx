import { NavLink } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import Banner from './Banner.jsx';

const link = ({ isActive }) =>
  `border-b-2 px-1 py-5 text-sm ${isActive ? 'border-brand font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'}`;

export default function Navbar() {
  const { favorites, notice } = useFavorites();
  return (
    <>
      <header className="border-b border-line bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-8 px-6" aria-label="Main">
          <span className="py-4 text-lg font-bold tracking-tight">RepoLens</span>
          <NavLink to="/" end className={link}>Search</NavLink>
          <NavLink to="/saved" className={link}>Saved ({favorites.length})</NavLink>
        </nav>
      </header>
      {notice && (
        <div className="fixed inset-x-0 top-4 z-10 mx-auto w-full max-w-md px-4">
          <Banner variant={notice.type}>{notice.text}</Banner>
        </div>
      )}
    </>
  );
}
