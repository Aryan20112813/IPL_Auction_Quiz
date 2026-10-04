import { NextRequest } from "next/server";
import { z } from "zod";
import { createHandler, successResponse } from "@/server/http/handler";
import { createQuiz } from "@/server/services/quiz.service";
import { checkRateLimit, getClientIp } from "@/server/http/rate-limit";

const createQuizSchema = z.object({
  title: z.string().trim().max(60, "Title must be at most 60 characters").optional(),
});

export const POST = createHandler(async (req: NextRequest) => {
  const ip = getClientIp(req.headers);
  checkRateLimit(`create:${ip}`, { windowMs: 60000, maxRequests: 10 });

  let body: any = {};
  try {
    body = await req.json();
  } catch (err) {
    // Body is optional
  }

  const parsed = createQuizSchema.parse(body);
  const result = await createQuiz(parsed.title);

  return successResponse(result, 201);
});
