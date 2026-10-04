import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireHost } from "@/server/auth/require-host";
import { startQuiz } from "@/server/services/quiz.service";

export const POST = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const quiz = await requireHost(req, params.code);
    const result = await startQuiz(quiz.id);
    return successResponse(result, 200);
  }
);
