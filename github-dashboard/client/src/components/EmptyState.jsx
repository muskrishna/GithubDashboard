export default function EmptyState({ title, children }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-10 text-center">
      <h2 className="text-[17px] font-semibold">{title}</h2>
      <div className="max-w-sm text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}
