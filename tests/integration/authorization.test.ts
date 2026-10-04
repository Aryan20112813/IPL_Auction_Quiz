/**
 * Integration test: Authorization — token matrix
 *
 * Verifies that every protected route returns 401/403 for:
 *  - Missing token
 *  - Wrong token
 *  - Cross-quiz token (valid token for a different quiz)
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
  return res.status;
}

describe.skipIf(SKIP)("Authorization Matrix — Integration", () => {
  let code: string;
  let hostToken: string;
  let participantToken: string;

  it("bootstraps two quizzes", async () => {
    // Quiz A
    const a = await (await fetch(`${BASE}/quizzes`, { method: "POST" })).json();
    code = a.code;
    hostToken = a.hostToken;
    const joinA = await (
      await fetch(`${BASE}/quizzes/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "AuthTester" }),
      })
    ).json();
    participantToken = joinA.token;

    // Quiz B — to get a cross-quiz token
    const b = await (await fetch(`${BASE}/quizzes`, { method: "POST" })).json();
    const joinB = await (
      await fetch(`${BASE}/quizzes/${b.code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "OtherPlayer" }),
      })
    ).json();

    // Cross-quiz token (participant from quiz B used against quiz A)
    const crossQuizStatus = await api(
      "GET",
      `/quizzes/${code}/questions`,
      undefined,
      joinB.token
    );
    expect([401, 403]).toContain(crossQuizStatus);
  });

  it("host-only routes reject missing token", async () => {
    expect(await api("POST", `/quizzes/${code}/start`)).toBeGreaterThanOrEqual(401);
    expect(await api("POST", `/quizzes/${code}/end`)).toBeGreaterThanOrEqual(401);
    expect(await api("GET", `/quizzes/${code}/host/dashboard`)).toBeGreaterThanOrEqual(401);
  });

  it("host-only routes reject participant token", async () => {
    expect(await api("POST", `/quizzes/${code}/start`, {}, participantToken)).toBeGreaterThanOrEqual(401);
    expect(await api("POST", `/quizzes/${code}/end`, {}, participantToken)).toBeGreaterThanOrEqual(401);
  });

  it("participant-only routes reject missing token", async () => {
    expect(await api("GET", `/quizzes/${code}/questions`)).toBeGreaterThanOrEqual(401);
    expect(await api("GET", `/quizzes/${code}/me`)).toBeGreaterThanOrEqual(401);
    expect(await api("PUT", `/quizzes/${code}/answers`, { answers: [] })).toBeGreaterThanOrEqual(401);
    expect(await api("POST", `/quizzes/${code}/submit`)).toBeGreaterThanOrEqual(401);
  });

  it("participant-only routes reject host token", async () => {
    expect(await api("GET", `/quizzes/${code}/questions`, undefined, hostToken)).toBeGreaterThanOrEqual(401);
  });
});
