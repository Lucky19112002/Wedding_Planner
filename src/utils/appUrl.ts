type AppUrlOptions = {
  baseUrl?: string;
  origin?: string;
};

function normalizeBase(baseUrl: string): string {
  if (!baseUrl || baseUrl === '/') return '/';
  return `/${baseUrl.replace(/^\/+|\/+$/g, '')}/`;
}

export function buildAppUrl(path: string, options: AppUrlOptions = {}): string {
  const origin = options.origin ?? window.location.origin;
  const base = normalizeBase(options.baseUrl ?? import.meta.env.BASE_URL);
  const cleanPath = path.replace(/^\/+/, '');

  return new URL(`${base}${cleanPath}`, origin).toString();
}
