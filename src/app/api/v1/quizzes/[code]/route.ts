import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { getQuizStatus } from "@/server/services/quiz.service";

export const GET = createHandler(
  async (_req: NextRequest, { params }: { params: { code: string } }) => {
    const status = await getQuizStatus(params.code);
    return successResponse(status, 200);
  }
);
