export const QuizState = {
  CREATED: "CREATED",
  WAITING: "WAITING",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  EXPIRED: "EXPIRED",
} as const;

export type QuizStateType = (typeof QuizState)[keyof typeof QuizState];

export const ParticipantStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  AUTO_SUBMITTED: "AUTO_SUBMITTED",
  REMOVED: "REMOVED",
} as const;

export type ParticipantStatusType = (typeof ParticipantStatus)[keyof typeof ParticipantStatus];

export const EndedReason = {
  HOST: "HOST",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type EndedReasonType = (typeof EndedReason)[keyof typeof EndedReason];

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  QUIZ_NOT_FOUND: "QUIZ_NOT_FOUND",
  NAME_TAKEN: "NAME_TAKEN",
  QUIZ_FULL: "QUIZ_FULL",
  INVALID_STATE: "INVALID_STATE",
  ALREADY_SUBMITTED: "ALREADY_SUBMITTED",
  QUIZ_CLOSED: "QUIZ_CLOSED",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL: "INTERNAL",
  QUESTION_BANK_INSUFFICIENT: "QUESTION_BANK_INSUFFICIENT",
  PARTICIPANT_REMOVED: "PARTICIPANT_REMOVED",
} as const;


export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
