const styles = {
  error: 'bg-red-50 text-red-900',
  warning: 'bg-amber-50 text-amber-900',
  info: 'bg-brand-soft text-brand-dark',
  success: 'bg-emerald-50 text-emerald-900',
};

export default function Banner({ variant = 'info', children }) {
  return (
    <div role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'} className={`rounded-lg px-4 py-3 text-sm font-medium shadow-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}
