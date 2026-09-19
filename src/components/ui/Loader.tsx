type LoaderProps = {
  label?: string;
};

export function Loader({ label = 'Loading' }: LoaderProps) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-600">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
      <span>{label}</span>
    </div>
  );
}
