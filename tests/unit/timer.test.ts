import { describe, it, expect } from "vitest";
import { computeEndsAt, isExpired } from "@/server/quiz/timer";
import { computeClockOffset, computeRemainingSeconds } from "@/lib/time";

describe("Timer and Clock synchronization", () => {
  it("calculates endsAt exactly equal to startedAt + durationSeconds", () => {
    const started = new Date("2026-03-01T10:00:00.000Z");
    const ends = computeEndsAt(started, 7200); // 2 hours
    expect(ends.toISOString()).toBe("2026-03-01T12:00:00.000Z");
  });

  it("checks expiration status correctly at boundaries", () => {
    const endsAt = new Date("2026-03-01T12:00:00.000Z");

    const before = new Date("2026-03-01T11:59:59.000Z");
    const at = new Date("2026-03-01T12:00:00.000Z");
    const after = new Date("2026-03-01T12:00:01.000Z");

    expect(isExpired(endsAt, before)).toBe(false);
    expect(isExpired(endsAt, at)).toBe(true);
    expect(isExpired(endsAt, after)).toBe(true);
  });

  it("computes clock offset taking RTT into account", () => {
    // Client sent request at t=1000, server processed at t=1050, response returned at t=1100
    // RTT = 100ms. Estimated one-way latency = 50ms.
    // Client clock was in sync with server clock:
    const offset = computeClockOffset("1970-01-01T00:00:01.050Z", 1000, 1100);
    expect(offset).toBe(0);
  });
});
