import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { joinQuizSchema } from "@/lib/validation/participant";
import { joinQuiz } from "@/server/services/participant.service";
import { checkRateLimit, getClientIp } from "@/server/http/rate-limit";

export const POST = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const ip = getClientIp(req.headers);
    // Generous rate limit for campus environments: 120 joins per min per IP
    checkRateLimit(`join:${ip}`, { windowMs: 60000, maxRequests: 120 });

    const body = await req.json();
    const parsed = joinQuizSchema.parse(body);

    const result = await joinQuiz(params.code, parsed.displayName);
    return successResponse(result, 201);
  }
);
