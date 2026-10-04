import { describe, it, expect } from "vitest";
import { generateRoomCode } from "@/server/quiz/room-code";
import { normalizeRoomCode, roomCodeSchema } from "@/lib/validation/room-code";
import { CONFIG } from "@/lib/config";

describe("Room Code Generation & Normalization", () => {
  it("generates a 6-character room code using only allowed characters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
      for (const char of code) {
        expect(CONFIG.ROOM_CODE_ALPHABET).toContain(char);
      }
      // Never contains confusing characters: 0, O, 1, I, L
      expect(code).not.toMatch(/[01OIL]/i);
    }
  });

  it("normalizes user input correctly (uppercases and strips spaces/hyphens)", () => {
    expect(normalizeRoomCode("k 7 m - 2 q x")).toBe("K7M2QX");
    expect(normalizeRoomCode("abcdef")).toBe("ABCDEF");
  });

  it("validates valid codes and rejects invalid characters or wrong lengths", () => {
    expect(roomCodeSchema.safeParse("K7M2QX").success).toBe(true);
    expect(roomCodeSchema.safeParse("k7m-2qx").success).toBe(true);
    // Invalid characters (e.g. 0, 1, O, I, L)
    expect(roomCodeSchema.safeParse("0ABCDE").success).toBe(false);
    expect(roomCodeSchema.safeParse("TOOLON").success).toBe(false); // Contains 'O'
    // Wrong length
    expect(roomCodeSchema.safeParse("ABC").success).toBe(false);
  });
});
