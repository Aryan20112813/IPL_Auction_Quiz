import { NextRequest } from "next/server";
import prisma from "../db/prisma";
import { hashToken, timingSafeMatch } from "./tokens";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "../http/errors";

export async function requireHost(req: NextRequest, roomCode: string) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Host authorization header missing or malformed");
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError("Host token missing");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { code: roomCode.toUpperCase() },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const suppliedHash = hashToken(token);
  if (!timingSafeMatch(quiz.hostTokenHash, suppliedHash)) {
    throw new ForbiddenError("Invalid host token for this quiz");
  }

  return quiz;
}
