"use client";

import * as React from "react";
import { getDailyPick } from "@/lib/game/engine";

export function useDailySeed() {
  return React.useMemo(() => getDailyPick(), []);
}
