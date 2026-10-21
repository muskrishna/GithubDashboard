import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../lib/api.js';

const FavoritesContext = createContext(null);
export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [notice, setNotice] = useState(null); 

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setFavorites(await getFavorites());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const isSaved = (githubId) => favorites.some((f) => f.githubId === githubId);

  async function save(repo) {
    try {
      const fav = await addFavorite(repo);
      setFavorites((prev) => [fav, ...prev]);
      setNotice({ type: 'success', text: `Saved ${repo.fullName}.` });
    } catch (err) {
      if (err.status === 409) {
        
        setNotice({ type: 'info', text: 'Already in your favourites. Duplicate not added.' });
        load();
      } else {
        setNotice({ type: 'error', text: err.message });
      }
    }
  }

  async function remove(githubId) {
    try {
      await removeFavorite(githubId);
      setFavorites((prev) => prev.filter((f) => f.githubId !== githubId));
      setNotice({ type: 'success', text: 'Removed from favourites.' });
    } catch (err) {
      if (err.status === 404) setFavorites((prev) => prev.filter((f) => f.githubId !== githubId));
      else setNotice({ type: 'error', text: err.message });
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, loading, loadError, notice, isSaved, save, remove, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}
