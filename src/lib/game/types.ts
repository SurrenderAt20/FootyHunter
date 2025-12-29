export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Item = {
  id: string;
  name: string;
  rarity: Rarity;
  hint: string;
};

export type DailyPick = {
  dateKey: string;
  seed: number;
  item: Item;
  index: number;
};
