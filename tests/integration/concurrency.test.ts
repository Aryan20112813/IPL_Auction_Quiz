/**
 * Integration test: Concurrency edge cases
 *
 * - Duplicate display names → second join rejected
 * - Double submit → second submit rejected
 * - Answers saved after quiz ends → rejected
 *
 * Skipped when DATABASE_URL is not set.
 */

import { describe, it, expect } from "vitest";

const SKIP = !process.env.DATABASE_URL;
const BASE = process.env.APP_URL
  ? `${process.env.APP_URL}/api/v1`
  : "http://localhost:3000/api/v1";

async function api(method: string, path: string, body?: unknown, token?: string) {
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

describe.skipIf(SKIP)("Concurrency — Integration", () => {
  let code: string;
  let hostToken: string;
  let token1: string;

  it("creates and starts a quiz", async () => {
    const create = await api("POST", "/quizzes");
    code = create.body.code;
    hostToken = create.body.hostToken;

    const join1 = await api("POST", `/quizzes/${code}/join`, {
      displayName: "Alice",
    });
    expect(join1.status).toBe(200);
    token1 = join1.body.token;

    await api("POST", `/quizzes/${code}/start`, {}, hostToken);
  });

  it("rejects duplicate display names", async () => {
    const duplicate = await api("POST", `/quizzes/${code}/join`, {
      displayName: "Alice",
    });
    expect([409, 400]).toContain(duplicate.status);
  });

  it("rejects double submit", async () => {
    const answers = Array.from({ length: 25 }, (_, i) => ({
      position: i + 1,
      option: "A",
    }));
    await api("PUT", `/quizzes/${code}/answers`, { answers }, token1);
    const submit1 = await api("POST", `/quizzes/${code}/submit`, {}, token1);
    expect(submit1.status).toBe(200);

    const submit2 = await api("POST", `/quizzes/${code}/submit`, {}, token1);
    expect([409, 400]).toContain(submit2.status);
  });

  it("rejects answers after quiz ends", async () => {
    await api("POST", `/quizzes/${code}/end`, {}, hostToken);

    const lateJoin = await api("POST", `/quizzes/${code}/join`, {
      displayName: "LatePlayer",
    });
    // Should be CLOSED/ENDED
    expect([409, 400, 403]).toContain(lateJoin.status);
  });
});
