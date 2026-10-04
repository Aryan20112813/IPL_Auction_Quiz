import { describe, it, expect } from "vitest";
import { normalizeDisplayName, displayNameSchema } from "@/lib/validation/participant";
import { saveAnswersSchema, submitQuizSchema } from "@/lib/validation/answers";

describe("Input Validation", () => {
  describe("Display Name", () => {
    it("normalizes display names cleanly", () => {
      expect(normalizeDisplayName("  Mumbai   Indians  ")).toBe("mumbai indians");
      expect(normalizeDisplayName("Team_A.1")).toBe("team_a.1");
    });

    it("accepts valid names between 2 and 30 characters", () => {
      expect(displayNameSchema.safeParse("CSK Kings").success).toBe(true);
      expect(displayNameSchema.safeParse("A1").success).toBe(true);
      expect(displayNameSchema.safeParse("Captain-7 & MS").success).toBe(true);
    });

    it("rejects names shorter than 2 or longer than 30 characters", () => {
      expect(displayNameSchema.safeParse("X").success).toBe(false);
      expect(displayNameSchema.safeParse("A".repeat(31)).success).toBe(false);
    });
  });

  describe("Answers Payload", () => {
    it("accepts valid answers payload", () => {
      const valid = {
        answers: [
          { position: 1, option: "A" },
          { position: 5, option: "C" },
          { position: 12, option: null },
        ],
      };
      expect(saveAnswersSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects duplicate question positions", () => {
      const duplicate = {
        answers: [
          { position: 4, option: "A" },
          { position: 4, option: "B" },
        ],
      };
      expect(saveAnswersSchema.safeParse(duplicate).success).toBe(false);
    });

    it("rejects positions outside 1..25", () => {
      const invalid = {
        answers: [{ position: 26, option: "A" }],
      };
      expect(saveAnswersSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
