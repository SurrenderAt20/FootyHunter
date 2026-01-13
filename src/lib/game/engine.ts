import { players } from "@/lib/data/players";
import type { DailyPick, Player, StatComparison, StatKey, TurnResult } from "./types";
import { dailySeed, mulberry32, utcDateKey } from "./seed";

export function getDailyPick(date = new Date()): DailyPick {
  const dateKey = utcDateKey(date);
  const seed = dailySeed(date);
  const rand = mulberry32(seed);

  const index = Math.floor(rand() * players.length);
  const item = players[index]!;

  return { dateKey, seed, item, index };
}

export const MAX_TURNS = 8;

export function compareStat(guessValue: number, targetValue: number): StatComparison {
  if (guessValue === targetValue) return "equal";
  return guessValue < targetValue ? "higher" : "lower";
}

/**
 * Evaluate one turn: a player guess + a chosen stat category.
 *
 * The feedback comparison is from the guesser's perspective:
 * - "higher" => the target is higher than your guess for that stat.
 * - "lower"  => the target is lower than your guess for that stat.
 * - "equal"  => exact match on that stat.
 */
export function evaluateTurn(params: {
  turn: number;
  guess: Player;
  target: Player;
  categoryId: StatKey;
}): TurnResult {
  const { turn, guess, target, categoryId } = params;

  const guessValue = guess.stats[categoryId];
  const targetValue = target.stats[categoryId];
  const comparison = compareStat(guessValue, targetValue);
  const correct = guess.id === target.id;

  return {
    turn,
    guessPlayerId: guess.id,
    categoryId,
    guessValue,
    targetValue,
    comparison,
    correct,
  };
}
