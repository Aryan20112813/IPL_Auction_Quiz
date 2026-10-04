import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { rejoinQuizSchema } from "@/lib/validation/participant";
import { rejoinQuiz } from "@/server/services/participant.service";
import { checkRateLimit, getClientIp } from "@/server/http/rate-limit";

export const POST = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const ip = getClientIp(req.headers);
    // Strict rate limit to prevent brute force: 5 attempts per min per IP
    checkRateLimit(`rejoin:${ip}`, { windowMs: 60000, maxRequests: 5 });

    const body = await req.json();
    const parsed = rejoinQuizSchema.parse(body);

    const result = await rejoinQuiz(params.code, parsed.displayName, parsed.recoveryCode);
    return successResponse(result, 200);
  }
);
