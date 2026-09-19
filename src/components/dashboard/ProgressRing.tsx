import { clampProgress, getReadinessLabel } from '@/utils/dashboardMetrics';

export function ProgressRing({ progress }: { progress: number }) {
  const value = clampProgress(progress);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-36 shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="stroke-slate-100" cx="50" cy="50" fill="none" r="42" strokeWidth="10" />
          <circle
            className="stroke-brand-600 transition-all duration-700"
            cx="50"
            cy="50"
            fill="none"
            r="42"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold">{value}%</span>
          <span className="text-xs text-slate-500">ready</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Wedding readiness</p>
        <h2 className="mt-2 text-2xl font-semibold">{getReadinessLabel(value)}</h2>
        <p className="mt-2 text-sm text-slate-600">Calculated from the existing Supabase progress views.</p>
      </div>
    </div>
  );
}
