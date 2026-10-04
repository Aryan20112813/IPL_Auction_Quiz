import { Prisma } from "@prisma/client";
import prisma from "./prisma";

/**
 * Wraps a function in a serializable transaction.
 * Retries up to 3 times on serialization failures (Postgres error 40001).
 */
export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (err: unknown) {
      const isSerializationError =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        (err.code === "P2034" || // Prisma serialization error
          (err.meta as Record<string, unknown>)?.code === "40001");

      if (isSerializationError && attempt < maxRetries - 1) {
        attempt++;
        // Exponential back-off: 50ms, 100ms, 200ms …
        await new Promise((r) => setTimeout(r, 50 * 2 ** attempt));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Acquires a SHARE lock on a quiz row within an existing transaction.
 * Prevents the row being modified by concurrent writers while we read.
 */
export async function lockQuizForShare(
  tx: Prisma.TransactionClient,
  quizId: string
) {
  return tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM quizzes WHERE id = ${quizId} FOR SHARE`;
}

/**
 * Acquires an UPDATE lock on a quiz row within an existing transaction.
 * Ensures exclusive access before modifying state.
 */
export async function lockQuizForUpdate(
  tx: Prisma.TransactionClient,
  quizId: string
) {
  return tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM quizzes WHERE id = ${quizId} FOR UPDATE`;
}

/**
 * Like lockQuizForUpdate but with NOWAIT — throws immediately if the row
 * is already locked rather than blocking.  Use for idempotency guards.
 */
export async function lockQuizForUpdateNoWait(
  tx: Prisma.TransactionClient,
  quizId: string
) {
  return tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM quizzes WHERE id = ${quizId} FOR UPDATE NOWAIT`;
}
