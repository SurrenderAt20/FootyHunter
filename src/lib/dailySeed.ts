/**
 * Daily seed logic
 *
 * We derive a stable integer seed from a calendar date in UTC.
 * This ensures everyone sees the same "daily" content regardless of locale.
 */

export function utcDateKey(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * FNV-1a 32-bit hash for strings.
 * Small, fast, deterministic. Good enough for daily selection.
 */
export function hash32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // force unsigned
  return h >>> 0;
}

export function dailySeed(date = new Date()): number {
  return hash32(utcDateKey(date));
}

/**
 * Deterministic PRNG (Mulberry32)
 * Returns a function producing floats in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
