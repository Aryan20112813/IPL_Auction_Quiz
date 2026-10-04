export interface ScoreResult {
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
}

/**
 * Pure scoring function used by unit tests and services
 */
export function scoreAnswers(
  answers: { position: number; selectedOption: string | null }[],
  correctMapByPosition: Record<number, string>,
  totalQuestions: number = 25
): ScoreResult {
  let correctCount = 0;
  let incorrectCount = 0;
  const answeredPositions = new Set<number>();

  for (const ans of answers) {
    if (ans.selectedOption && ans.position >= 1 && ans.position <= totalQuestions) {
      answeredPositions.add(ans.position);
      const correct = correctMapByPosition[ans.position];
      if (ans.selectedOption.toUpperCase() === correct?.toUpperCase()) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  }

  const unansweredCount = Math.max(0, totalQuestions - answeredPositions.size);
  const score = correctCount; // +1 per correct answer, 0 for wrong/unanswered

  return {
    score,
    correctCount,
    incorrectCount,
    unansweredCount,
  };
}
