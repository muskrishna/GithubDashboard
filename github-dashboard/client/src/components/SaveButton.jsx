import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function SaveButton({ repo, label = 'Save' }) {
  const { isSaved, save } = useFavorites();
  const [busy, setBusy] = useState(false);
  const saved = isSaved(repo.githubId);

  async function onClick() {
    setBusy(true);
    await save(repo);
    setBusy(false);
  }

  if (saved) {
    return (
      <button className="btn border border-brand bg-brand-soft text-brand-dark" disabled aria-label={`${repo.fullName} is saved`}>
        Saved
      </button>
    );
  }
  return (
    <button className="btn-primary" onClick={onClick} disabled={busy}>
      {busy ? 'Saving…' : label}
    </button>
  );
}
