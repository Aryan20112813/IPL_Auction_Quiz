export function computeEndsAt(startedAt: Date, durationSeconds: number): Date {
  return new Date(startedAt.getTime() + durationSeconds * 1000);
}

export function isExpired(endsAt: Date | null, now: Date = new Date()): boolean {
  if (!endsAt) return false;
  return now.getTime() >= endsAt.getTime();
}
