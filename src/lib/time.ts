/**
 * Time calculation and formatting utilities
 */

export function computeClockOffset(
  serverTimeIso: string,
  tRequestSent: number,
  tResponseReceived: number
): number {
  const rtt = Math.max(0, tResponseReceived - tRequestSent);
  const serverTimeMs = new Date(serverTimeIso).getTime();
  // Smoothed estimated offset: (serverTime + rtt / 2) - clientNow
  return serverTimeMs + rtt / 2 - tResponseReceived;
}

export function computeRemainingSeconds(
  endsAtIso: string | null | undefined,
  offsetMs: number = 0
): number {
  if (!endsAtIso) return 0;
  const endsAtMs = new Date(endsAtIso).getTime();
  const estimatedServerNow = Date.now() + offsetMs;
  const remainingMs = endsAtMs - estimatedServerNow;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

export function formatDuration(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatTimeTaken(ms: number | bigint): string {
  const totalSeconds = Math.max(0, Math.floor(Number(ms) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
