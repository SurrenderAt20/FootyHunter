import type { TurnResult } from "@/lib/game/types";

function tileForTurn(turn: TurnResult): string {
  // Share tiles should be spoiler-free about absolute values.
  // We encode outcome only:
  // - correct guess: 🟩
  // - stat match (but wrong player): 🟦
  // - target higher than guess: ⬆️
  // - target lower than guess: ⬇️
  if (turn.correct) return "🟩";
  if (turn.comparison === "equal") return "🟦";
  return turn.comparison === "higher" ? "⬆️" : "⬇️";
}

export function buildShareText(params: {
  dateKey: string;
  status: "playing" | "solved" | "failed";
  turns: TurnResult[];
}): string {
  const { dateKey, status, turns } = params;

  const header =
    status === "solved"
      ? `FootyHunter ${dateKey} — ${turns.length}/8`
      : status === "failed"
        ? `FootyHunter ${dateKey} — X/8`
        : `FootyHunter ${dateKey} — ${turns.length}/8 (in progress)`;

  const row = turns.map(tileForTurn).join(" ");
  const legend = "🟩 correct  🟦 stat match  ⬆️ target higher  ⬇️ target lower";

  // Keep it compact and friendly for sharing.
  return [header, row || "(no turns yet)", legend, "https://github.com/SurrenderAt20/FootyHunter"].join(
    "\n",
  );
}
