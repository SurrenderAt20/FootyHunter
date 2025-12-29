import { items } from "@/lib/data/items";
import type { DailyPick } from "./types";
import { dailySeed, mulberry32, utcDateKey } from "./seed";

export function getDailyPick(date = new Date()): DailyPick {
  const dateKey = utcDateKey(date);
  const seed = dailySeed(date);
  const rand = mulberry32(seed);

  const index = Math.floor(rand() * items.length);
  const item = items[index]!;

  return { dateKey, seed, item, index };
}
