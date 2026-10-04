import prisma from "../db/prisma";
import { QuizState, ParticipantStatus, EndedReasonType } from "@/lib/constants";
import { computeTimeTakenMs } from "../ranking/time-taken";
import { scoreAnswers } from "../ranking/score";
import { assignRanks } from "../ranking/rank";

export async function finalizeQuiz(
  quizId: string,
  reason: EndedReasonType
) {
  return await prisma.$transaction(async (tx) => {
    const quiz = await tx.quiz.findUnique({
      where: { id: quizId },
      include: {
        quizQuestions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!quiz) {
      return null;
    }

    // Idempotent: if already closed, return
    if (quiz.state === QuizState.ENDED || quiz.state === QuizState.EXPIRED) {
      return quiz;
    }

    const now = new Date();

    // If quiz was cancelled before it started
    if (quiz.state === QuizState.WAITING) {
      return await tx.quiz.update({
        where: { id: quizId },
        data: {
          state: QuizState.ENDED,
          endedAt: now,
          endedReason: "CANCELLED",
        },
      });
    }

    // Determine close timestamp
    const closeAt =
      reason === "HOST"
        ? quiz.endsAt && now.getTime() > quiz.endsAt.getTime()
          ? quiz.endsAt
          : now
        : quiz.endsAt || now;

    const targetState = reason === "HOST" ? QuizState.ENDED : QuizState.EXPIRED;

    // 1. Lock / update quiz state
    const updatedQuiz = await tx.quiz.update({
      where: { id: quizId },
      data: {
        state: targetState,
        endedAt: closeAt,
        endedReason: reason,
      },
    });

    // 2. Auto-submit any participant who is still IN_PROGRESS
    await tx.participant.updateMany({
      where: {
        quizId,
        status: ParticipantStatus.IN_PROGRESS,
      },
      data: {
        status: ParticipantStatus.AUTO_SUBMITTED,
        submittedAt: closeAt,
      },
    });

    // 3. Build answer key map: position -> correctOption
    const correctMap: Record<number, string> = {};
    for (const qq of quiz.quizQuestions) {
      correctMap[qq.position] = qq.question.correctOption;
    }

    // 4. Fetch all participants with their answers
    const participants = await tx.participant.findMany({
      where: { quizId },
      include: {
        answers: true,
      },
    });

    // 5. Calculate scores and time_taken_ms for all participants
    const unrankedResults = participants.map((p) => {
      const scoring = scoreAnswers(p.answers, correctMap, quiz.questionCount);
      const timeTakenMs = computeTimeTakenMs(p.joinedAt, quiz.startedAt, p.submittedAt || closeAt);

      return {
        participantId: p.id,
        quizId,
        score: scoring.score,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        timeTakenMs,
        joinedAt: p.joinedAt,
      };
    });

    // 6. Assign official ranks
    const rankedResults = assignRanks(unrankedResults);

    // 7. Persist final results
    for (const res of rankedResults) {
      await tx.result.upsert({
        where: { participantId: res.participantId },
        update: {
          score: res.score,
          correctCount: res.correctCount,
          incorrectCount: res.incorrectCount,
          unansweredCount: res.unansweredCount,
          timeTakenMs: res.timeTakenMs,
          rank: res.rank,
          isFinal: true,
        },
        create: {
          participantId: res.participantId,
          quizId,
          score: res.score,
          correctCount: res.correctCount,
          incorrectCount: res.incorrectCount,
          unansweredCount: res.unansweredCount,
          timeTakenMs: res.timeTakenMs,
          rank: res.rank,
          isFinal: true,
        },
      });
    }

    return updatedQuiz;
  });
}
