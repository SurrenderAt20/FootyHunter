import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Optional leaderboard submit endpoint.
 *
 * For now, this is just a stub so the route exists.
 * We'll add validation + storage once we decide where scores live.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json(
    {
      ok: true,
      received: body,
      message: "Score endpoint not implemented yet (stub).",
    },
    { status: 200 },
  );
}
