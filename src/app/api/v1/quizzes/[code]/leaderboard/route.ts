import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireHost } from "@/server/auth/require-host";
import { requireParticipant } from "@/server/auth/require-participant";
import { getLeaderboard } from "@/server/services/leaderboard.service";
import { paginationSchema } from "@/lib/validation/pagination";
import { UnauthorizedError } from "@/server/http/errors";

export const GET = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const { searchParams } = new URL(req.url);
    const parsedPagination = paginationSchema.parse({
      limit: searchParams.get("limit") || 50,
      offset: searchParams.get("offset") || 0,
      sort: searchParams.get("sort") || "rank",
    });

    let isHost = false;
    let participantId: string | undefined = undefined;

    // Check host auth first
    try {
      await requireHost(req, params.code);
      isHost = true;
    } catch {
      // If not host, check participant auth
      try {
        const { participant } = await requireParticipant(req, params.code);
        participantId = participant.id;
      } catch {
        throw new UnauthorizedError("Valid host or participant token required");
      }
    }

    const leaderboard = await getLeaderboard(
      params.code,
      isHost,
      participantId,
      parsedPagination.limit,
      parsedPagination.offset
    );

    return successResponse(leaderboard, 200);
  }
);
