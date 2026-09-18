import { describe, expect, it } from 'vitest';
import { detectLinkProvider, isValidShoppingUrl } from '@/utils/shoppingLinks';

describe('shoppingLinks', () => {
  it('validates only http and https URLs', () => {
    expect(isValidShoppingUrl('https://example.com/item')).toBe(true);
    expect(isValidShoppingUrl('http://example.com/item')).toBe(true);
    expect(isValidShoppingUrl('ftp://example.com/item')).toBe(false);
    expect(isValidShoppingUrl('not a url')).toBe(false);
  });

  it('detects known shopping and reference providers', () => {
    expect(detectLinkProvider('https://www.amazon.in/product').name).toBe('Amazon');
    expect(detectLinkProvider('https://pin.it/example').name).toBe('Pinterest');
    expect(detectLinkProvider('https://boutique.example/item').name).toBe('Link');
  });
});
