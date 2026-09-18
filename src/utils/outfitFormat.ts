import type { Outfit } from '@/types/domain';

export function formatOutfitTitle(outfit: Outfit): string {
  return outfit.dressType || 'Untitled outfit';
}

export function formatOutfitSummary(outfit: Outfit): string {
  const colour = outfit.colour || 'Colour not set';
  return `${colour} · Qty ${outfit.quantity}`;
}
