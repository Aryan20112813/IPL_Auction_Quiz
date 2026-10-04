import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireParticipant } from "@/server/auth/require-participant";
import { saveAnswersSchema } from "@/lib/validation/answers";
import { saveAnswers } from "@/server/services/answer.service";

export const PUT = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const { participant } = await requireParticipant(req, params.code);
    const body = await req.json();
    const parsed = saveAnswersSchema.parse(body);

    const result = await saveAnswers(participant.id, parsed.answers);
    return successResponse(result, 200);
  }
);
