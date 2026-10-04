import prisma from "../db/prisma";
import { CONFIG } from "@/lib/config";
import { normalizeDisplayName } from "@/lib/validation/participant";
import { generateToken, generateRecoveryCode, hashToken, timingSafeMatch } from "../auth/tokens";
import { isQuizClosed, getEffectiveState } from "../quiz/state";
import {
  NotFoundError,
  QuizClosedError,
  NameTakenError,
  QuizFullError,
  UnauthorizedError,
  ForbiddenError,
} from "../http/errors";

export async function joinQuiz(roomCode: string, displayName: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { code: roomCode.toUpperCase() },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const effectiveState = getEffectiveState(quiz, new Date());
  if (isQuizClosed(effectiveState)) {
    throw new QuizClosedError();
  }

  const normalizedName = normalizeDisplayName(displayName);

  // Check duplicate name
  const existing = await prisma.participant.findUnique({
    where: {
      quizId_normalizedName: {
        quizId: quiz.id,
        normalizedName,
      },
    },
  });

  if (existing) {
    throw new NameTakenError("This team name is already taken in this quiz. Please choose another name.");
  }

  // Check participant cap
  const currentCount = await prisma.participant.count({
    where: { quizId: quiz.id },
  });

  if (currentCount >= CONFIG.MAX_PARTICIPANTS) {
    throw new QuizFullError();
  }

  const participantToken = generateToken();
  const recoveryCode = generateRecoveryCode();
  const tokenHash = hashToken(participantToken);
  const recoveryCodeHash = hashToken(recoveryCode);

  try {
    const participant = await prisma.participant.create({
      data: {
        quizId: quiz.id,
        displayName: displayName.trim(),
        normalizedName,
        tokenHash,
        recoveryCodeHash,
        status: "IN_PROGRESS",
      },
    });

    return {
      participantId: participant.id,
      participantToken,
      recoveryCode,
      displayName: participant.displayName,
      state: effectiveState,
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new NameTakenError("This team name is already taken in this quiz. Please choose another name.");
    }
    throw err;
  }
}

export async function rejoinQuiz(
  roomCode: string,
  displayName: string,
  recoveryCode: string
) {
  const quiz = await prisma.quiz.findUnique({
    where: { code: roomCode.toUpperCase() },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const normalizedName = normalizeDisplayName(displayName);

  const participant = await prisma.participant.findUnique({
    where: {
      quizId_normalizedName: {
        quizId: quiz.id,
        normalizedName,
      },
    },
  });

  if (!participant) {
    throw new UnauthorizedError("Invalid display name or recovery code");
  }

  if (participant.status === "REMOVED") {
    throw new ForbiddenError("You have been removed from this quiz by the host");
  }

  const suppliedRecoveryHash = hashToken(recoveryCode.toUpperCase());
  if (!timingSafeMatch(participant.recoveryCodeHash, suppliedRecoveryHash)) {
    throw new UnauthorizedError("Invalid recovery code");
  }

  // Re-issue a new participant token
  const newParticipantToken = generateToken();
  const newTokenHash = hashToken(newParticipantToken);

  const updated = await prisma.participant.update({
    where: { id: participant.id },
    data: { tokenHash: newTokenHash },
  });

  const effectiveState = getEffectiveState(quiz, new Date());

  return {
    participantId: updated.id,
    participantToken: newParticipantToken,
    displayName: updated.displayName,
    status: updated.status as any,
    state: effectiveState,
  };
}

export async function removeParticipant(quizId: string, participantId: string) {
  const participant = await prisma.participant.findFirst({
    where: { id: participantId, quizId },
  });

  if (!participant) {
    throw new NotFoundError("Participant not found");
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { status: "REMOVED" },
  });

  return { success: true, participantId };
}


export async function getMe(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      quiz: true,
      result: true,
      answers: true,
    },
  });

  if (!participant) {
    throw new NotFoundError("Participant not found");
  }

  const quiz = participant.quiz;
  const effectiveState = getEffectiveState(quiz, new Date());
  const resultsReady = isQuizClosed(effectiveState);

  let resultPayload = undefined;
  if (resultsReady && participant.result) {
    resultPayload = {
      rank: participant.result.rank,
      score: participant.result.score,
      maxScore: quiz.questionCount,
      timeTakenMs: Number(participant.result.timeTakenMs),
    };
  }

  return {
    participantId: participant.id,
    displayName: participant.displayName,
    status: participant.status as any,
    answeredCount: participant.answers.length,
    state: effectiveState,
    resultsReady,
    startedAt: quiz.startedAt?.toISOString() || null,
    endsAt: quiz.endsAt?.toISOString() || null,
    result: resultPayload,
  };
}
