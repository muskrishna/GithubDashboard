//ye pages dikhayega 1 2 3 ....100
function pageList(page, total) {
  const set = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('gap-' + n);
    out.push(n);
  });
  return out;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const base = 'btn min-w-[44px] border border-slate-300 bg-white';
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-2" aria-label="Pagination">
      <button className={base} disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
      {pageList(page, totalPages).map((n) =>
        typeof n === 'string' ? (
          <span key={n} className="px-1 text-muted">…</span>
        ) : (
          <button
            key={n}
            aria-current={n === page ? 'page' : undefined}
            className={n === page ? 'btn min-w-[44px] bg-brand text-white' : base}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        )
      )}
      <button className={base} disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
