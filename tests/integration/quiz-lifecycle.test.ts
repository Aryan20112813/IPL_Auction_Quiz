/**
 * Integration test: Full quiz lifecycle
 *
 * Prerequisites:
 *  - A real PostgreSQL database seeded with questions.
 *  - DATABASE_URL env var pointing to it.
 *  - Run via: vitest run tests/integration/quiz-lifecycle.test.ts
 *
 * Flow:
 *  1. Host creates a quiz   → POST /quizzes
 *  2. Participants join     → POST /quizzes/{code}/join
 *  3. Host starts quiz      → POST /quizzes/{code}/start
 *  4. Participants fetch questions → GET /quizzes/{code}/questions
 *  5. Participants save answers   → PUT /quizzes/{code}/answers
 *  6. Participants submit         → POST /quizzes/{code}/submit
 *  7. Host ends quiz              → POST /quizzes/{code}/end
 *  8. Leaderboard available       → GET /quizzes/{code}/leaderboard
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

/**
 * NOTE: These tests require a running Postgres instance.
 * They are skipped in environments without DATABASE_URL set.
 *
 * To run locally:
 *   docker compose up -d
 *   npx prisma db push
 *   tsx prisma/seed.ts
 *   vitest run tests/integration
 */
const SKIP = !process.env.DATABASE_URL;

describe.skipIf(SKIP)("Quiz Lifecycle — Integration", () => {
  let quizCode: string;
  let hostToken: string;
  const participantTokens: string[] = [];

  const BASE = process.env.APP_URL
    ? `${process.env.APP_URL}/api/v1`
    : "http://localhost:3000/api/v1";

  async function api(
    method: string,
    path: string,
    body?: unknown,
    token?: string
  ) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: await res.json() };
  }

  it("creates a quiz", async () => {
    const { status, body } = await api("POST", "/quizzes");
    expect(status).toBe(201);
    expect(body.code).toMatch(/^[A-Z]{6}$/);
    quizCode = body.code;
    hostToken = body.hostToken;
  });

  it("lets 3 participants join", async () => {
    for (const name of ["Alice", "Bob", "Charlie"]) {
      const { status, body } = await api("POST", `/quizzes/${quizCode}/join`, {
        displayName: name,
      });
      expect(status).toBe(200);
      participantTokens.push(body.token);
    }
  });

  it("host starts the quiz", async () => {
    const { status } = await api(
      "POST",
      `/quizzes/${quizCode}/start`,
      {},
      hostToken
    );
    expect(status).toBe(200);
  });

  it("participants fetch questions (no correct_option leak)", async () => {
    for (const token of participantTokens) {
      const { status, body } = await api(
        "GET",
        `/quizzes/${quizCode}/questions`,
        undefined,
        token
      );
      expect(status).toBe(200);
      expect(body.questions).toHaveLength(25);
      for (const q of body.questions) {
        expect(q).not.toHaveProperty("correct_option");
        expect(q).not.toHaveProperty("correctOption");
      }
    }
  });

  it("participants answer and submit", async () => {
    const answers = Array.from({ length: 25 }, (_, i) => ({
      position: i + 1,
      option: "A",
    }));

    for (const token of participantTokens) {
      const saveRes = await api(
        "PUT",
        `/quizzes/${quizCode}/answers`,
        { answers },
        token
      );
      expect(saveRes.status).toBe(200);

      const submitRes = await api(
        "POST",
        `/quizzes/${quizCode}/submit`,
        {},
        token
      );
      expect(submitRes.status).toBe(200);
    }
  });

  it("host ends the quiz and leaderboard appears", async () => {
    const endRes = await api("POST", `/quizzes/${quizCode}/end`, {}, hostToken);
    expect(endRes.status).toBe(200);

    const lbRes = await api(
      "GET",
      `/quizzes/${quizCode}/leaderboard`,
      undefined,
      participantTokens[0]
    );
    expect(lbRes.status).toBe(200);
    expect(lbRes.body.rows.length).toBeGreaterThanOrEqual(3);
  });
});
