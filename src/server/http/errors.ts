import { ErrorCode, ErrorCodeType } from "@/lib/constants";

export class AppError extends Error {
  public code: ErrorCodeType;
  public statusCode: number;

  constructor(code: ErrorCodeType, message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Invalid request payload") {
    super(ErrorCode.VALIDATION_ERROR, message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authorization required") {
    super(ErrorCode.UNAUTHORIZED, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(ErrorCode.FORBIDDEN, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Quiz not found") {
    super(ErrorCode.QUIZ_NOT_FOUND, message, 404);
  }
}

export class NameTakenError extends AppError {
  constructor(message: string = "This name is already taken in this quiz. If this is you, use your recovery code to rejoin.") {
    super(ErrorCode.NAME_TAKEN, message, 409);
  }
}

export class QuizFullError extends AppError {
  constructor(message: string = "Quiz has reached the maximum number of participants") {
    super(ErrorCode.QUIZ_FULL, message, 409);
  }
}

export class InvalidStateError extends AppError {
  constructor(message: string = "Action not permitted in current quiz state") {
    super(ErrorCode.INVALID_STATE, message, 409);
  }
}

export class AlreadySubmittedError extends AppError {
  constructor(message: string = "Participant has already submitted their answers") {
    super(ErrorCode.ALREADY_SUBMITTED, message, 409);
  }
}

export class QuizClosedError extends AppError {
  constructor(message: string = "This quiz has ended or expired") {
    super(ErrorCode.QUIZ_CLOSED, message, 410);
  }
}

export class RateLimitedError extends AppError {
  constructor(message: string = "Too many requests. Please slow down.") {
    super(ErrorCode.RATE_LIMITED, message, 429);
  }
}

export class QuestionBankInsufficientError extends AppError {
  constructor(message: string = "Fewer than 25 active questions available in the question bank") {
    super(ErrorCode.QUESTION_BANK_INSUFFICIENT, message, 503);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "An unexpected internal error occurred") {
    super(ErrorCode.INTERNAL, message, 500);
  }
}
