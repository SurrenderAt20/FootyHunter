import type { Item } from "./types";

// Static JSON dataset (bundled at build time)
import rawItems from "./items.json";

export const items: Item[] = rawItems as Item[];
