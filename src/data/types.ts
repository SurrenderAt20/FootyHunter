export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Item = {
  id: string;
  name: string;
  rarity: Rarity;
  hint: string;
};
