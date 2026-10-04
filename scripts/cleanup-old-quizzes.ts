/**
 * Cleanup Old Quizzes Script
 *
 * Usage: tsx scripts/cleanup-old-quizzes.ts [--days <N>] [--dry-run]
 *
 * Deletes quizzes (and all cascaded rows) that:
 *  - are in ENDED or EXPIRED state
 *  - have ended_at older than <N> days ago (default: 30)
 *
 * Safe to run as a cron job.  Always idempotent.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const daysIdx = args.indexOf("--days");
const DAYS = daysIdx !== -1 ? Number(args[daysIdx + 1]) : 30;

if (isNaN(DAYS) || DAYS < 1) {
  console.error("--days must be a positive integer");
  process.exit(1);
}

async function main() {
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  console.log(
    `Cleanup: deleting quizzes with ended_at < ${cutoff.toISOString()} ` +
      `(${DAYS} days ago)${dryRun ? " [DRY RUN]" : ""}`
  );

  // Find candidates first so we can log them
  const candidates = await prisma.quiz.findMany({
    where: {
      state: { in: ["ENDED", "EXPIRED"] },
      endedAt: { lt: cutoff },
    },
    select: { id: true, code: true, endedAt: true, state: true },
  });

  console.log(`Found ${candidates.length} quiz(zes) to delete.`);
  for (const q of candidates) {
    console.log(
      `  • ${q.code}  state=${q.state}  ended_at=${q.endedAt?.toISOString() ?? "null"}`
    );
  }

  if (dryRun) {
    console.log("Dry run — no rows deleted.");
    return;
  }

  if (candidates.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  const ids = candidates.map((q) => q.id);

  // Prisma cascades handle participants, answers, results, quiz_questions
  const { count } = await prisma.quiz.deleteMany({
    where: { id: { in: ids } },
  });

  console.log(`Deleted ${count} quiz(zes) successfully.`);
}

main()
  .catch((err) => {
    console.error("Cleanup failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
