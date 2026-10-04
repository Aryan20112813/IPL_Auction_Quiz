import crypto from "crypto";
import { QuestionBankInsufficientError } from "../http/errors";

export type RngFunction = (maxExclusive: number) => number;

const defaultRng: RngFunction = (maxExclusive: number) => {
  return crypto.randomInt(0, maxExclusive);
};

/**
 * Selects count distinct items uniformly at random using partial Fisher-Yates shuffle.
 */
export function selectQuestions(
  activeIds: string[],
  count: number = 25,
  rng: RngFunction = defaultRng
): string[] {
  if (activeIds.length < count) {
    throw new QuestionBankInsufficientError();
  }

  const pool = [...activeIds];
  for (let i = 0; i < count; i++) {
    // Pick uniform random index in [i, pool.length)
    const remaining = pool.length - i;
    const j = i + rng(remaining);
    // Swap
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  return pool.slice(0, count);
}
