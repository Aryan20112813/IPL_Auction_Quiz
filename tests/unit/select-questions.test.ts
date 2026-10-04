import { describe, it, expect } from "vitest";
import { selectQuestions } from "@/server/quiz/select-questions";
import { QuestionBankInsufficientError } from "@/server/http/errors";

describe("selectQuestions", () => {
  const sampleBank = Array.from({ length: 100 }, (_, i) => `Q${String(i + 1).padStart(3, "0")}`);

  it("selects exactly 25 questions by default", () => {
    const selected = selectQuestions(sampleBank, 25);
    expect(selected).toHaveLength(25);
  });

  it("selects all distinct questions (no duplicates)", () => {
    const selected = selectQuestions(sampleBank, 25);
    const unique = new Set(selected);
    expect(unique.size).toBe(25);
  });

  it("throws QuestionBankInsufficientError if active bank has fewer than 25 questions", () => {
    const smallBank = ["Q001", "Q002", "Q003"];
    expect(() => selectQuestions(smallBank, 25)).toThrow(QuestionBankInsufficientError);
  });

  it("produces deterministic results with a fixed RNG", () => {
    // Deterministic mock RNG that always picks 0
    const mockRng = () => 0;
    const selected1 = selectQuestions(sampleBank, 25, mockRng);
    const selected2 = selectQuestions(sampleBank, 25, mockRng);
    expect(selected1).toEqual(selected2);
    expect(selected1[0]).toBe(sampleBank[0]);
  });
});
