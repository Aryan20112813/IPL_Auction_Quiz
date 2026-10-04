import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireParticipant } from "@/server/auth/require-participant";
import { submitQuizSchema } from "@/lib/validation/answers";
import { submitQuiz } from "@/server/services/answer.service";

export const POST = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const { participant } = await requireParticipant(req, params.code);

    let body: any = {};
    try {
      body = await req.json();
    } catch (err) {
      // Body optional
    }

    const parsed = submitQuizSchema.parse(body);
    const result = await submitQuiz(participant.id, parsed.answers);
    return successResponse(result, 200);
  }
);
