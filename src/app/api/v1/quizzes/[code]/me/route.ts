import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireParticipant } from "@/server/auth/require-participant";
import { getMe } from "@/server/services/participant.service";

export const GET = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const { participant } = await requireParticipant(req, params.code);
    const result = await getMe(participant.id);
    return successResponse(result, 200);
  }
);
