import { NextResponse } from "next/server";
import { getDailyPick } from "@/lib/game/engine";

export const runtime = "edge";

export async function GET() {
  const daily = getDailyPick();
  return NextResponse.json({
    dateKey: daily.dateKey,
    seed: daily.seed,
    index: daily.index,
    // Don't leak the answer by default.
    hint: daily.item.hint,
  });
}
