import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireHost } from "@/server/auth/require-host";
import { endQuiz } from "@/server/services/quiz.service";

export const POST = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const quiz = await requireHost(req, params.code);
    const result = await endQuiz(quiz.id);
    return successResponse(result, 200);
  }
);
