import { QuizStateType, ParticipantStatusType, ErrorCodeType } from "../constants";

export interface ApiErrorResponse {
  error: {
    code: ErrorCodeType;
    message: string;
  };
  serverTime: string;
}

export interface QuizStatusDto {
  code: string;
  title: string | null;
  state: QuizStateType;
  resultsReady: boolean;
  startedAt: string | null;
  endsAt: string | null;
  participantCount: number;
  questionCount: number;
  serverTime: string;
}

export interface CreateQuizResponseDto {
  code: string;
  title: string | null;
  state: QuizStateType;
  questionCount: number;
  durationSeconds: number;
  hostToken: string;
  createdAt: string;
  serverTime: string;
}

export interface JoinQuizResponseDto {
  participantId: string;
  participantToken: string;
  recoveryCode: string;
  displayName: string;
  state: QuizStateType;
  serverTime: string;
}

export interface RejoinQuizResponseDto {
  participantId: string;
  participantToken: string;
  displayName: string;
  status: ParticipantStatusType;
  state: QuizStateType;
  serverTime: string;
}

export interface QuestionDto {
  position: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface QuestionsResponseDto {
  questions: QuestionDto[];
  answers: Record<number, "A" | "B" | "C" | "D">;
  endsAt: string;
  serverTime: string;
}

export interface SaveAnswersResponseDto {
  saved: number;
  answeredCount: number;
  state: QuizStateType;
  endsAt: string | null;
  serverTime: string;
}

export interface SubmitResponseDto {
  status: "SUBMITTED";
  submittedAt: string;
  answeredCount: number;
  serverTime: string;
}

export interface ParticipantMeDto {
  participantId: string;
  displayName: string;
  status: ParticipantStatusType;
  answeredCount: number;
  state: QuizStateType;
  resultsReady: boolean;
  startedAt: string | null;
  endsAt: string | null;
  result?: {
    rank: number | null;
    score: number;
    maxScore: number;
    timeTakenMs: number;
  };
  serverTime: string;
}

export interface LeaderboardRowDto {
  rank: number | null;
  name: string;
  score: number;
  timeTakenMs: number;
  isYou?: boolean;
}

export interface LeaderboardResponseDto {
  isFinal: boolean;
  rows: LeaderboardRowDto[];
  page: {
    limit: number;
    offset: number;
    total: number;
  };
  serverTime: string;
}

export interface HostDashboardRowDto {
  rank: number | null;
  participantId: string;
  name: string;
  status: ParticipantStatusType;
  answered: number;
  score: number | null;
  incorrect: number | null;
  timeTakenMs: number | null;
}

export interface HostDashboardDto {
  state: QuizStateType;
  endsAt: string | null;
  isFinal: boolean;
  counts: {
    joined: number;
    inProgress: number;
    submitted: number;
    autoSubmitted: number;
  };
  rows: HostDashboardRowDto[];
  page: {
    limit: number;
    offset: number;
    total: number;
  };
  serverTime: string;
}
