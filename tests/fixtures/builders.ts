/**
 * Test fixtures — shared builders for integration and E2E tests.
 *
 * All helpers return plain objects matching the Prisma input types.
 * Use them to seed a real database in integration tests.
 */

import type {
  QuizStateType,
  ParticipantStatusType,
} from "@/lib/constants";

/** Build a minimal Quiz input object. */
export function buildQuiz(overrides: {
  state?: QuizStateType;
  code?: string;
  questionCount?: number;
} = {}) {
  return {
    code: overrides.code ?? "TESTAA",
    host_token_hash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    state: overrides.state ?? ("WAITING" as QuizStateType),
    question_count: overrides.questionCount ?? 25,
    duration_seconds: 7200,
    max_participants: 300,
    started_at: null,
    ended_at: null,
    expires_at: null,
  };
}

/** Build a minimal Participant input object. */
export function buildParticipant(overrides: {
  quizId?: string;
  displayName?: string;
  normalizedName?: string;
  status?: ParticipantStatusType;
} = {}) {
  return {
    quiz_id: overrides.quizId ?? "quiz-id-placeholder",
    display_name: overrides.displayName ?? "TestPlayer",
    normalized_name: overrides.normalizedName ?? "testplayer",
    token_hash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    status: overrides.status ?? ("IN_PROGRESS" as ParticipantStatusType),
    score: null,
    rank: null,
    time_taken_ms: null,
  };
}

/** Build a minimal Answer input object. */
export function buildAnswer(overrides: {
  participantId?: string;
  quizId?: string;
  position?: number;
  selectedOption?: string | null;
  isCorrect?: boolean;
} = {}) {
  return {
    participant_id: overrides.participantId ?? "participant-id-placeholder",
    quiz_id: overrides.quizId ?? "quiz-id-placeholder",
    position: overrides.position ?? 1,
    selected_option: overrides.selectedOption ?? "A",
    is_correct: overrides.isCorrect ?? false,
  };
}

/** Sample questions for seeding integration tests (no answer leak risk — these are fixture stubs). */
export const SAMPLE_QUESTIONS = Array.from({ length: 25 }, (_, i) => ({
  position: i + 1,
  text: `Sample question ${i + 1}?`,
  option_a: "Option A",
  option_b: "Option B",
  option_c: "Option C",
  option_d: "Option D",
  correct_option: "A",
  difficulty: "MEDIUM" as const,
}));
