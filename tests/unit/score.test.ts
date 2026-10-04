import { describe, it, expect } from "vitest";
import { scoreAnswers } from "@/server/ranking/score";

describe("scoreAnswers", () => {
  // Correct key: 1..25 alternating A, B, C, D
  const correctMap: Record<number, string> = {};
  for (let i = 1; i <= 25; i++) {
    correctMap[i] = ["A", "B", "C", "D"][(i - 1) % 4];
  }

  it("scores 25 for all-correct answers", () => {
    const answers = Object.entries(correctMap).map(([pos, opt]) => ({
      position: Number(pos),
      selectedOption: opt,
    }));

    const result = scoreAnswers(answers, correctMap, 25);
    expect(result.score).toBe(25);
    expect(result.correctCount).toBe(25);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(0);
  });

  it("scores 0 for all-incorrect answers", () => {
    const answers = Object.entries(correctMap).map(([pos, opt]) => ({
      position: Number(pos),
      selectedOption: opt === "A" ? "B" : "A", // wrong answer
    }));

    const result = scoreAnswers(answers, correctMap, 25);
    expect(result.score).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(25);
    expect(result.unansweredCount).toBe(0);
  });

  it("scores 0 for empty / completely unanswered", () => {
    const result = scoreAnswers([], correctMap, 25);
    expect(result.score).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(25);
  });

  it("correctly calculates mixed correct, incorrect, and unanswered counts", () => {
    const answers = [
      { position: 1, selectedOption: correctMap[1] }, // Correct (+1)
      { position: 2, selectedOption: correctMap[2] }, // Correct (+1)
      { position: 3, selectedOption: "Z" },           // Incorrect
      // 4..25 unanswered (22 unanswered)
    ];

    const result = scoreAnswers(answers, correctMap, 25);
    expect(result.score).toBe(2);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(1);
    expect(result.unansweredCount).toBe(22);
  });
});
