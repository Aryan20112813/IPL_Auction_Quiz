import prisma from "../db/prisma";
import { toLeaderboardRowDto } from "../dto/leaderboard.dto";
import { isQuizClosed, getEffectiveState } from "../quiz/state";
import { NotFoundError, ForbiddenError } from "../http/errors";

export async function getLeaderboard(
  roomCode: string,
  isHost: boolean,
  participantId?: string,
  limit: number = 50,
  offset: number = 0
) {
  const quiz = await prisma.quiz.findUnique({
    where: { code: roomCode.toUpperCase() },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const effectiveState = getEffectiveState(quiz, new Date());
  const isFinal = isQuizClosed(effectiveState);

  // If quiz is not closed, participants cannot view leaderboard
  if (!isFinal && !isHost) {
    throw new ForbiddenError("Leaderboard is not available until the quiz has ended");
  }

  // Fetch results
  const total = await prisma.result.count({
    where: {
      quizId: quiz.id,
      ...(isFinal ? { isFinal: true } : {}),
    },
  });

  const results = await prisma.result.findMany({
    where: {
      quizId: quiz.id,
      ...(isFinal ? { isFinal: true } : {}),
    },
    include: {
      participant: {
        select: {
          displayName: true,
        },
      },
    },
    orderBy: [
      { score: "desc" },
      { timeTakenMs: "asc" },
    ],
    take: limit,
    skip: offset,
  });

  const rows = results.map((r) => toLeaderboardRowDto(r, participantId));

  return {
    isFinal,
    rows,
    page: {
      limit,
      offset,
      total,
    },
  };
}
