import { RateLimitedError } from "./errors";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const tracker = new Map<string, number[]>();

export function checkRateLimit(key: string, config: RateLimitConfig): void {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let timestamps = tracker.get(key) || [];
  // Retain only requests in the active window
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= config.maxRequests) {
    throw new RateLimitedError();
  }

  timestamps.push(now);
  tracker.set(key, timestamps);

  // Periodic cleanup if map grows too large
  if (tracker.size > 10000) {
    for (const [k, ts] of tracker.entries()) {
      if (ts.every((t) => t <= windowStart)) {
        tracker.delete(k);
      }
    }
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
