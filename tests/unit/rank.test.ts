import { describe, it, expect } from "vitest";
import { assignRanks } from "@/server/ranking/rank";

describe("assignRanks", () => {
  it("orders participants by score descending", () => {
    const participants = [
      { participantId: "p1", score: 18, timeTakenMs: 1000 },
      { participantId: "p2", score: 24, timeTakenMs: 2000 },
      { participantId: "p3", score: 20, timeTakenMs: 1500 },
    ];

    const ranked = assignRanks(participants);
    expect(ranked[0].participantId).toBe("p2");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].participantId).toBe("p3");
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].participantId).toBe("p1");
    expect(ranked[2].rank).toBe(3);
  });

  it("breaks score ties by shorter timeTakenMs", () => {
    const participants = [
      { participantId: "slower", score: 22, timeTakenMs: 50000 },
      { participantId: "faster", score: 22, timeTakenMs: 30000 },
    ];

    const ranked = assignRanks(participants);
    expect(ranked[0].participantId).toBe("faster");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].participantId).toBe("slower");
    expect(ranked[1].rank).toBe(2);
  });

  it("assigns shared ranks (1, 2, 2, 4) on exact ties", () => {
    const participants = [
      { participantId: "p1", score: 25, timeTakenMs: 10000 },
      { participantId: "p2", score: 22, timeTakenMs: 20000 },
      { participantId: "p3", score: 22, timeTakenMs: 20000 }, // Exact tie with p2
      { participantId: "p4", score: 19, timeTakenMs: 15000 },
    ];

    const ranked = assignRanks(participants);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].rank).toBe(2);
    expect(ranked[3].rank).toBe(4); // Standard competition ranking: 1, 2, 2, 4
  });
});
