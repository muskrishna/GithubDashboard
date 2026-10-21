import { useEffect, useState } from 'react';
import Banner from './Banner.jsx';

//ek error box show krega errror ya success message ko
export default function ErrorBanner({ error, onRetry }) {
  const [left, setLeft] = useState(error?.retryAfter ?? 0);

  useEffect(() => {
    setLeft(error?.status === 429 ? error.retryAfter ?? 60 : 0);
  }, [error]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  if (!error) return null;
  const limited = error.status === 429;

  return (
    <Banner variant={limited ? 'warning' : 'error'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>
          {limited
            ? left > 0 ? `GitHub rate limit reached. Try again in ${left} seconds.` : 'The rate limit has reset. You can try again.'
            : error.message}
        </span>
        {onRetry && (
          <button className="btn-outline" onClick={onRetry} disabled={limited && left > 0}>
            Try again
          </button>
        )}
      </div>
    </Banner>
  );
}
