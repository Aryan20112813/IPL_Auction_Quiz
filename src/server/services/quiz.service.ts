import prisma from "../db/prisma";
import { CONFIG } from "@/lib/config";
import { QuizState, EndedReason } from "@/lib/constants";
import { selectQuestions } from "../quiz/select-questions";
import { generateRoomCode } from "../quiz/room-code";
import { generateToken, hashToken } from "../auth/tokens";
import { getEffectiveState, isQuizClosed } from "../quiz/state";
import { computeEndsAt, isExpired } from "../quiz/timer";
import { finalizeQuiz } from "../quiz/finalize";
import { assignRanks } from "../ranking/rank";
import {
  NotFoundError,
  QuestionBankInsufficientError,
  QuizClosedError,
  InvalidStateError,
} from "../http/errors";

export async function createQuiz(title?: string) {
  // 1. Fetch all active question IDs
  const activeQuestions = await prisma.question.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  if (activeQuestions.length < CONFIG.QUESTION_COUNT) {
    throw new QuestionBankInsufficientError();
  }

  const activeIds = activeQuestions.map((q) => q.id);
  const pickedIds = selectQuestions(activeIds, CONFIG.QUESTION_COUNT);

  const rawHostToken = generateToken();
  const hostTokenHash = hashToken(rawHostToken);

  // 2. Retry loop for unique room code
  let createdQuiz = null;
  let attempts = 0;

  while (attempts < 5 && !createdQuiz) {
    attempts++;
    const code = generateRoomCode();

    try {
      createdQuiz = await prisma.$transaction(async (tx) => {
        const quiz = await tx.quiz.create({
          data: {
            code,
            title: title?.trim() || null,
            state: QuizState.WAITING,
            hostTokenHash,
            questionCount: CONFIG.QUESTION_COUNT,
            durationSeconds: CONFIG.QUIZ_DURATION_SECONDS,
          },
        });

        // Insert 25 quiz questions
        const quizQuestionsData = pickedIds.map((qId, index) => ({
          quizId: quiz.id,
          position: index + 1,
          questionId: qId,
        }));

        for (const item of quizQuestionsData) {
          await tx.quizQuestion.create({ data: item });
        }

        return quiz;
      });
    } catch (err: any) {
      // Prisma unique constraint code P2002
      if (err.code === "P2002" && attempts < 5) {
        continue;
      }
      throw err;
    }
  }

  if (!createdQuiz) {
    throw new Error("Failed to generate unique room code after 5 attempts");
  }

  return {
    code: createdQuiz.code,
    title: createdQuiz.title,
    state: createdQuiz.state,
    questionCount: createdQuiz.questionCount,
    durationSeconds: createdQuiz.durationSeconds,
    hostToken: rawHostToken,
    createdAt: createdQuiz.createdAt.toISOString(),
  };
}

export async function getQuizStatus(roomCode: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { code: roomCode.toUpperCase() },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const now = new Date();
  let effectiveState = getEffectiveState(quiz, now);

  // Lazy expiry check
  if (quiz.state === QuizState.ACTIVE && isExpired(quiz.endsAt, now)) {
    await finalizeQuiz(quiz.id, EndedReason.EXPIRED);
    effectiveState = QuizState.EXPIRED;
  }

  const participantCount = await prisma.participant.count({
    where: { quizId: quiz.id },
  });

  const resultsReady = isQuizClosed(effectiveState);

  return {
    code: quiz.code,
    title: quiz.title,
    state: effectiveState,
    resultsReady,
    startedAt: quiz.startedAt?.toISOString() || null,
    endsAt: quiz.endsAt?.toISOString() || null,
    participantCount,
    questionCount: quiz.questionCount,
  };
}

export async function startQuiz(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  // Idempotent start if already active
  if (quiz.state === QuizState.ACTIVE) {
    return {
      state: quiz.state,
      startedAt: quiz.startedAt?.toISOString() || null,
      endsAt: quiz.endsAt?.toISOString() || null,
    };
  }

  if (isQuizClosed(quiz.state as any)) {
    throw new QuizClosedError();
  }

  if (quiz.state !== QuizState.WAITING) {
    throw new InvalidStateError("Quiz is not in WAITING state");
  }

  const startedAt = new Date();
  const endsAt = computeEndsAt(startedAt, quiz.durationSeconds);

  const updated = await prisma.quiz.update({
    where: { id: quizId },
    data: {
      state: QuizState.ACTIVE,
      startedAt,
      endsAt,
    },
  });

  return {
    state: updated.state,
    startedAt: updated.startedAt?.toISOString() || null,
    endsAt: updated.endsAt?.toISOString() || null,
  };
}

export async function endQuiz(quizId: string) {
  const updated = await finalizeQuiz(quizId, EndedReason.HOST);
  if (!updated) {
    throw new NotFoundError("Quiz not found");
  }

  const participantCount = await prisma.participant.count({
    where: { quizId },
  });

  return {
    state: updated.state,
    endedAt: updated.endedAt?.toISOString() || null,
    resultsReady: true,
    participantCount,
  };
}

export async function getHostDashboard(
  quizId: string,
  limit: number = 50,
  offset: number = 0,
  sort: "rank" | "name" = "rank"
) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  // Check lazy expiry
  const now = new Date();
  if (quiz.state === QuizState.ACTIVE && isExpired(quiz.endsAt, now)) {
    await finalizeQuiz(quizId, EndedReason.EXPIRED);
  }

  const isFinal = isQuizClosed(quiz.state as any);

  // Participant counts
  const [joined, inProgress, submitted, autoSubmitted] = await Promise.all([
    prisma.participant.count({ where: { quizId } }),
    prisma.participant.count({ where: { quizId, status: "IN_PROGRESS" } }),
    prisma.participant.count({ where: { quizId, status: "SUBMITTED" } }),
    prisma.participant.count({ where: { quizId, status: "AUTO_SUBMITTED" } }),
  ]);

  // Fetch participants with their results and answers
  const participants = await prisma.participant.findMany({
    where: { quizId },
    include: {
      result: true,
      answers: true,
    },
  });

  let mappedRows;

  if (isFinal) {
    // Read stored final results
    mappedRows = participants.map((p) => ({
      rank: p.result?.rank ?? null,
      participantId: p.id,
      name: p.displayName,
      status: p.status as any,
      answered: p.answers.length,
      score: p.result?.score ?? null,
      incorrect: p.result?.incorrectCount ?? null,
      timeTakenMs: p.result?.timeTakenMs ? Number(p.result.timeTakenMs) : null,
      joinedAt: p.joinedAt,
    }));
  } else {
    // Provisional live dashboard: rank only submitted participants
    const submittedOnly = participants.filter((p) => p.status === "SUBMITTED" && p.result);
    const unsubmitted = participants.filter((p) => p.status !== "SUBMITTED" || !p.result);

    const rankable = submittedOnly.map((p) => ({
      participantId: p.id,
      score: p.result?.score || 0,
      timeTakenMs: p.result?.timeTakenMs ? BigInt(p.result.timeTakenMs) : BigInt(0),
      joinedAt: p.joinedAt,
      displayName: p.displayName,
      status: p.status,
      answered: p.answers.length,
      incorrect: p.result?.incorrectCount ?? null,
    }));

    const provisionalRanked = assignRanks(rankable);

    const rankedRows = provisionalRanked.map((item) => ({
      rank: item.rank,
      participantId: item.participantId,
      name: item.displayName,
      status: item.status as any,
      answered: item.answered,
      score: item.score,
      incorrect: item.incorrect,
      timeTakenMs: Number(item.timeTakenMs),
      joinedAt: item.joinedAt,
    }));

    const unrankedRows = unsubmitted.map((p) => ({
      rank: null,
      participantId: p.id,
      name: p.displayName,
      status: p.status as any,
      answered: p.answers.length,
      score: null,
      incorrect: null,
      timeTakenMs: null,
      joinedAt: p.joinedAt,
    }));

    mappedRows = [...rankedRows, ...unrankedRows];
  }

  // Sort rows
  if (sort === "name") {
    mappedRows.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    mappedRows.sort((a, b) => {
      if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
      if (a.rank !== null) return -1;
      if (b.rank !== null) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  const total = mappedRows.length;
  const paginatedRows = mappedRows.slice(offset, offset + limit);

  return {
    state: quiz.state,
    endsAt: quiz.endsAt?.toISOString() || null,
    isFinal,
    counts: {
      joined,
      inProgress,
      submitted,
      autoSubmitted,
    },
    rows: paginatedRows,
    page: {
      limit,
      offset,
      total,
    },
  };
}
