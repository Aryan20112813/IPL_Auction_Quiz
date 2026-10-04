import prisma from "../db/prisma";
import { toQuestionDto } from "../dto/question.dto";
import { getEffectiveState, isQuizClosed } from "../quiz/state";
import { isExpired } from "../quiz/timer";
import { scoreAnswers } from "../ranking/score";
import { computeTimeTakenMs } from "../ranking/time-taken";
import { finalizeQuiz } from "../quiz/finalize";
import {
  NotFoundError,
  QuizClosedError,
  InvalidStateError,
  AlreadySubmittedError,
} from "../http/errors";

export async function getQuestions(participantId: string, quizId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      quiz: {
        include: {
          quizQuestions: {
            orderBy: { position: "asc" },
            include: { question: true },
          },
        },
      },
      answers: true,
    },
  });

  if (!participant) {
    throw new NotFoundError("Participant not found");
  }

  const quiz = participant.quiz;
  const now = new Date();
  const effectiveState = getEffectiveState(quiz, now);

  if (isQuizClosed(effectiveState)) {
    throw new QuizClosedError();
  }

  if (effectiveState !== "ACTIVE") {
    throw new InvalidStateError("Quiz has not started yet");
  }

  if (isExpired(quiz.endsAt, now)) {
    await finalizeQuiz(quiz.id, "EXPIRED");
    throw new QuizClosedError("Quiz time has expired");
  }

  if (participant.status !== "IN_PROGRESS") {
    throw new AlreadySubmittedError();
  }

  // Map questions securely without answer keys
  const questions = quiz.quizQuestions.map(toQuestionDto);

  // Map answers to Record<number, string>
  const answers: Record<number, "A" | "B" | "C" | "D"> = {};
  for (const ans of participant.answers) {
    answers[ans.position] = ans.selectedOption as "A" | "B" | "C" | "D";
  }

  return {
    questions,
    answers,
    endsAt: quiz.endsAt?.toISOString() || "",
  };
}

export async function saveAnswers(
  participantId: string,
  answersList: { position: number; option: string | null }[]
) {
  return await prisma.$transaction(async (tx) => {
    const participant = await tx.participant.findUnique({
      where: { id: participantId },
      include: { quiz: true },
    });

    if (!participant) {
      throw new NotFoundError("Participant not found");
    }

    const quiz = participant.quiz;
    const now = new Date();
    const effectiveState = getEffectiveState(quiz, now);

    if (isQuizClosed(effectiveState) || isExpired(quiz.endsAt, now)) {
      throw new QuizClosedError();
    }

    if (effectiveState !== "ACTIVE") {
      throw new InvalidStateError("Quiz is not active");
    }

    if (participant.status !== "IN_PROGRESS") {
      throw new AlreadySubmittedError();
    }

    let savedCount = 0;
    for (const item of answersList) {
      if (item.option === null) {
        // Clear answer
        await tx.answer.deleteMany({
          where: {
            participantId,
            position: item.position,
          },
        });
      } else {
        // Upsert answer
        await tx.answer.upsert({
          where: {
            participantId_position: {
              participantId,
              position: item.position,
            },
          },
          update: {
            selectedOption: item.option,
            savedAt: now,
          },
          create: {
            participantId,
            position: item.position,
            selectedOption: item.option,
            savedAt: now,
          },
        });
        savedCount++;
      }
    }

    const answeredCount = await tx.answer.count({
      where: { participantId },
    });

    return {
      saved: savedCount,
      answeredCount,
      state: effectiveState,
      endsAt: quiz.endsAt?.toISOString() || null,
    };
  });
}

export async function submitQuiz(
  participantId: string,
  answersSnapshot?: { position: number; option: string | null }[]
) {
  return await prisma.$transaction(async (tx) => {
    const participant = await tx.participant.findUnique({
      where: { id: participantId },
      include: {
        quiz: {
          include: {
            quizQuestions: {
              include: { question: true },
            },
          },
        },
      },
    });

    if (!participant) {
      throw new NotFoundError("Participant not found");
    }

    const quiz = participant.quiz;
    const now = new Date();

    // Idempotent: If already submitted, return original submission details
    if (participant.status !== "IN_PROGRESS") {
      const answeredCount = await tx.answer.count({ where: { participantId } });
      return {
        status: participant.status,
        submittedAt: participant.submittedAt?.toISOString() || now.toISOString(),
        answeredCount,
      };
    }

    const effectiveState = getEffectiveState(quiz, now);
    if (isQuizClosed(effectiveState) || isExpired(quiz.endsAt, now)) {
      throw new QuizClosedError();
    }

    if (effectiveState !== "ACTIVE") {
      throw new InvalidStateError("Quiz is not active");
    }

    // Apply optional answers snapshot
    if (answersSnapshot && answersSnapshot.length > 0) {
      for (const item of answersSnapshot) {
        if (item.option === null) {
          await tx.answer.deleteMany({
            where: { participantId, position: item.position },
          });
        } else {
          await tx.answer.upsert({
            where: {
              participantId_position: {
                participantId,
                position: item.position,
              },
            },
            update: {
              selectedOption: item.option,
              savedAt: now,
            },
            create: {
              participantId,
              position: item.position,
              selectedOption: item.option,
              savedAt: now,
            },
          });
        }
      }
    }

    // Mark participant as submitted
    const submittedAt = now;
    await tx.participant.update({
      where: { id: participantId },
      data: {
        status: "SUBMITTED",
        submittedAt,
      },
    });

    // Fetch updated answers to calculate provisional score
    const allAnswers = await tx.answer.findMany({
      where: { participantId },
    });

    // Build question correct map
    const correctMap: Record<number, string> = {};
    for (const qq of quiz.quizQuestions) {
      correctMap[qq.position] = qq.question.correctOption;
    }

    const scoring = scoreAnswers(allAnswers, correctMap, quiz.questionCount);
    const timeTakenMs = computeTimeTakenMs(participant.joinedAt, quiz.startedAt, submittedAt);

    // Save provisional result (is_final = false, rank = null)
    await tx.result.upsert({
      where: { participantId },
      update: {
        score: scoring.score,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        timeTakenMs,
        rank: null,
        isFinal: false,
      },
      create: {
        participantId,
        quizId: quiz.id,
        score: scoring.score,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        timeTakenMs,
        rank: null,
        isFinal: false,
      },
    });

    return {
      status: "SUBMITTED",
      submittedAt: submittedAt.toISOString(),
      answeredCount: allAnswers.length,
    };
  });
}
