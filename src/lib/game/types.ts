export type DailyPick = {
  dateKey: string;
  seed: number;
  item: Player;
  index: number;
};

export type StatKey =
  | "cl_games"
  | "cl_goals"
  | "intl_caps"
  | "intl_goals"
  | "league_apps"
  | "league_goals"
  | "ballon_dor"
  | "assists";

export type Category = {
  id: StatKey;
  label: string;
  description?: string;
};

export type Player = {
  id: string;
  name: string;
  nationality: string;
  club: string;
  position: "GK" | "DF" | "MF" | "FW";
  stats: Record<StatKey, number>;
};

export type StatComparison = "higher" | "lower" | "equal";

export type TurnResult = {
  turn: number; // 1..8
  guessPlayerId: string;
  categoryId: StatKey;
  guessValue: number;
  targetValue: number;
  comparison: StatComparison;
  correct: boolean;
};
