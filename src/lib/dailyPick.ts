import { items } from "@/data/items";
import type { Item } from "@/data/types";
import { dailySeed, mulberry32, utcDateKey } from "./dailySeed";

export type DailyPick = {
  dateKey: string;
  seed: number;
  item: Item;
  index: number;
};

export function getDailyPick(date = new Date()): DailyPick {
  const dateKey = utcDateKey(date);
  const seed = dailySeed(date);
  const rand = mulberry32(seed);

  const index = Math.floor(rand() * items.length);
  const item = items[index]!;

  return { dateKey, seed, item, index };
}
