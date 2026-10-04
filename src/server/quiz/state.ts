import { QuizState, QuizStateType } from "@/lib/constants";
import { QuizClosedError, InvalidStateError } from "../http/errors";

export function getEffectiveState(
  quiz: { state: string; endsAt: Date | null },
  now: Date = new Date()
): QuizStateType {
  if (quiz.state === QuizState.ACTIVE && quiz.endsAt && now.getTime() >= quiz.endsAt.getTime()) {
    return QuizState.EXPIRED;
  }
  return quiz.state as QuizStateType;
}

export function isQuizClosed(state: QuizStateType): boolean {
  return state === QuizState.ENDED || state === QuizState.EXPIRED;
}

export function assertQuizOpen(state: QuizStateType): void {
  if (isQuizClosed(state)) {
    throw new QuizClosedError();
  }
}

export function assertQuizActive(state: QuizStateType): void {
  if (isQuizClosed(state)) {
    throw new QuizClosedError();
  }
  if (state !== QuizState.ACTIVE) {
    throw new InvalidStateError("Quiz is not currently active");
  }
}

export function assertQuizWaiting(state: QuizStateType): void {
  if (isQuizClosed(state)) {
    throw new QuizClosedError();
  }
  if (state !== QuizState.WAITING) {
    throw new InvalidStateError("Action only allowed when quiz is in lobby (WAITING)");
  }
}
