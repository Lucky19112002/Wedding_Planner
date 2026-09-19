export const maxShoppingLinks = 5;

export type LinkProvider = {
  domain: string;
  icon: string;
  name: string;
};

const providers: Array<LinkProvider & { match: string[] }> = [
  { domain: 'myntra.com', icon: 'M', match: ['myntra.'], name: 'Myntra' },
  { domain: 'amazon.com', icon: 'A', match: ['amazon.', 'amzn.'], name: 'Amazon' },
  { domain: 'pinterest.com', icon: 'P', match: ['pinterest.', 'pin.it'], name: 'Pinterest' },
  { domain: 'instagram.com', icon: 'I', match: ['instagram.'], name: 'Instagram' },
];

export function getLinkDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Invalid URL';
  }
}

export function detectLinkProvider(url: string): LinkProvider {
  const domain = getLinkDomain(url);
  const provider = providers.find((item) => item.match.some((match) => domain.includes(match)));
  if (provider) return { domain, icon: provider.icon, name: provider.name };
  return { domain, icon: 'L', name: 'Link' };
}

export function isValidShoppingUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
