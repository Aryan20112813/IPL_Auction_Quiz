import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireHost } from "@/server/auth/require-host";
import { removeParticipant } from "@/server/services/participant.service";

export const DELETE = createHandler(
  async (req: NextRequest, { params }: { params: { code: string; participantId: string } }) => {
    const quiz = await requireHost(req, params.code);
    const result = await removeParticipant(quiz.id, params.participantId);
    return successResponse(result, 200);
  }
);
