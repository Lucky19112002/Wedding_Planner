import { describe, expect, it } from 'vitest';
import { buildAppUrl } from './appUrl';

describe('buildAppUrl', () => {
  it('uses the configured app base for GitHub Pages URLs', () => {
    expect(
      buildAppUrl('/invite/token-123', {
        baseUrl: '/Wedding_Planner/',
        origin: 'https://lucky19112002.github.io',
      }),
    ).toBe('https://lucky19112002.github.io/Wedding_Planner/invite/token-123');
  });

  it('keeps root-based local and custom-domain URLs clean', () => {
    expect(buildAppUrl('/invite/token-123', { baseUrl: '/', origin: 'http://localhost:5173' })).toBe(
      'http://localhost:5173/invite/token-123',
    );
  });
});
