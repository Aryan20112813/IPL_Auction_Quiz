/**
 * Compute time taken in milliseconds according to PRD §10.2:
 * effective_start = max(participant.joined_at, quiz.started_at)
 * time_taken_ms = participant.submitted_at - effective_start
 */
export function computeTimeTakenMs(
  joinedAt: Date,
  startedAt: Date | null,
  submittedAt: Date | null
): bigint {
  if (!submittedAt) {
    return BigInt(0);
  }

  const effectiveStartMs = startedAt
    ? Math.max(joinedAt.getTime(), startedAt.getTime())
    : joinedAt.getTime();

  const diffMs = Math.max(0, submittedAt.getTime() - effectiveStartMs);
  return BigInt(diffMs);
}
