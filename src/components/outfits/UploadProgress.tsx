export function UploadProgress({ progress }: { progress: number }) {
  if (progress <= 0) return null;

  return (
    <div className="rounded-md bg-slate-100 p-3">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>Uploading image</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
