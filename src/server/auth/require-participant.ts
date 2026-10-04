import { NextRequest } from "next/server";
import prisma from "../db/prisma";
import { hashToken } from "./tokens";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "../http/errors";

export async function requireParticipant(req: NextRequest, roomCode: string) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Participant authorization header missing or malformed");
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError("Participant token missing");
  }

  const tokenHash = hashToken(token);
  const participant = await prisma.participant.findFirst({
    where: { tokenHash },
    include: { quiz: true },
  });

  if (!participant) {
    throw new UnauthorizedError("Invalid participant session");
  }

  if (participant.quiz.code.toUpperCase() !== roomCode.toUpperCase()) {
    throw new ForbiddenError("Participant does not belong to this quiz room");
  }

  return { participant, quiz: participant.quiz };
}
