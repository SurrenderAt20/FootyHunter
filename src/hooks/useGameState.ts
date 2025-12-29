"use client";

import * as React from "react";
import { getDailyPick } from "@/lib/game/engine";
import { useLocalStorageState } from "./useLocalStorageState";

export type GameState = {
  dateKey: string;
  guesses: string[];
  isSolved: boolean;
};

const STORAGE_KEY = "footyhunter.state.v1";

function defaultStateForToday(): GameState {
  const { dateKey } = getDailyPick();
  return { dateKey, guesses: [], isSolved: false };
}

type GameActions = {
  guess: (itemId: string) => void;
  reset: () => void;
};

type GameStore = {
  state: GameState;
  actions: GameActions;
  isHydrated: boolean;
};

const GameContext = React.createContext<GameStore | null>(null);

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
      guess(itemId) {
        setState((prev) => {
          if (prev.isSolved) return prev;
          if (prev.guesses.includes(itemId)) return prev;

          const solved = itemId === today.item.id;
          return {
            ...prev,
            guesses: [...prev.guesses, itemId],
            isSolved: solved,
          };
        });
      },
      reset() {
        setState(defaultStateForToday());
      },
    };
  }, [setState, today.item.id]);

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
