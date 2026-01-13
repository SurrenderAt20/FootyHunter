"use client";

import * as React from "react";
import { MAX_TURNS, evaluateTurn, getDailyPick } from "@/lib/game/engine";
import { categories } from "@/lib/data/categories";
import { players } from "@/lib/data/players";
import type { Player, StatKey, TurnResult } from "@/lib/game/types";
import { useLocalStorageState } from "./useLocalStorageState";

export type GameState = {
  dateKey: string;

  // Turn history in order.
  turns: TurnResult[];

  // Convenience caches for UI.
  usedCategories: StatKey[];

  // Resolved status.
  status: "playing" | "solved" | "failed";
};

const STORAGE_KEY = "footyhunter.state.v2";

function defaultStateForToday(): GameState {
  const { dateKey } = getDailyPick();
  return {
    dateKey,
    turns: [],
    usedCategories: [],
    status: "playing",
  };
}

type GameActions = {
  submitTurn: (params: { guessPlayerId: string; categoryId: StatKey }) => void;
  reset: () => void;
};

type GameStore = {
  state: GameState;
  actions: GameActions;
  isHydrated: boolean;
};

const GameContext = React.createContext<GameStore | null>(null);

function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

function isCategoryValid(categoryId: StatKey): boolean {
  return categories.some((c) => c.id === categoryId);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const today = getDailyPick();
  const [state, setState, { isHydrated }] = useLocalStorageState<GameState>(
    STORAGE_KEY,
    defaultStateForToday(),
  );

  React.useEffect(() => {
    if (!isHydrated) return;
    if (state.dateKey !== today.dateKey) {
      setState(defaultStateForToday());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, today.dateKey]);

  const actions = React.useMemo<GameActions>(() => {
    return {
      submitTurn({ guessPlayerId, categoryId }) {
        setState((prev) => {
          if (prev.status !== "playing") return prev;
          if (prev.turns.length >= MAX_TURNS) return { ...prev, status: "failed" };
          if (prev.usedCategories.includes(categoryId)) return prev;
          if (!isCategoryValid(categoryId)) return prev;

          const guess = getPlayerById(guessPlayerId);
          if (!guess) return prev;

          const target = today.item;
          const turnNumber = prev.turns.length + 1;

          const result = evaluateTurn({
            turn: turnNumber,
            guess,
            target,
            categoryId,
          });

          const nextTurns = [...prev.turns, result];
          const nextUsed = [...prev.usedCategories, categoryId];

          let nextStatus: GameState["status"] = prev.status;
          if (result.correct) nextStatus = "solved";
          else if (nextTurns.length >= MAX_TURNS) nextStatus = "failed";

          return {
            ...prev,
            turns: nextTurns,
            usedCategories: nextUsed,
            status: nextStatus,
          };
        });
      },
      reset() {
        setState(defaultStateForToday());
      },
    };
  }, [setState, today.item]);

  const store: GameStore = React.useMemo(
    () => ({ state, actions, isHydrated }),
    [actions, isHydrated, state],
  );

  return React.createElement(GameContext.Provider, { value: store }, children);
}

export function useGameState() {
  const ctx = React.useContext(GameContext);
  if (!ctx) throw new Error("useGameState must be used within <GameProvider />");
  return ctx;
}
