import { NextRequest, NextResponse } from "next/server";
import { createHandler } from "@/server/http/handler";
import { requireParticipant } from "@/server/auth/require-participant";
import { getQuestions } from "@/server/services/answer.service";

export const GET = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const { participant, quiz } = await requireParticipant(req, params.code);
    const data = await getQuestions(participant.id, quiz.id);

    const res = NextResponse.json({
      ...data,
      serverTime: new Date().toISOString(),
    });
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
);
