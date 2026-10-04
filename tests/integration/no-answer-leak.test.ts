/**
 * Integration test: No answer-key leak
 *
 * Scans every public/participant-facing API response to ensure
 * `correct_option` / `correctOption` never appears.
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
  return { status: res.status, text: await res.text() };
}

function hasAnswerLeak(text: string): boolean {
  return (
    text.includes("correct_option") ||
    text.includes("correctOption") ||
    text.includes("\"correct\"")
  );
}

describe.skipIf(SKIP)("No Answer Key Leak — Integration", () => {
  let quizCode: string;
  let hostToken: string;
  let participantToken: string;

  it("sets up quiz for leak check", async () => {
    const createRes = await api("POST", "/quizzes");
    const createBody = JSON.parse(createRes.text);
    quizCode = createBody.code;
    hostToken = createBody.hostToken;

    const joinRes = await api("POST", `/quizzes/${quizCode}/join`, {
      displayName: "LeakChecker",
    });
    const joinBody = JSON.parse(joinRes.text);
    participantToken = joinBody.token;

    await api("POST", `/quizzes/${quizCode}/start`, {}, hostToken);
  });

  it("GET /questions does not leak correct_option", async () => {
    const { text } = await api(
      "GET",
      `/quizzes/${quizCode}/questions`,
      undefined,
      participantToken
    );
    expect(hasAnswerLeak(text)).toBe(false);
  });

  it("GET /quizzes/{code} (public status) does not leak correct_option", async () => {
    const { text } = await api("GET", `/quizzes/${quizCode}`);
    expect(hasAnswerLeak(text)).toBe(false);
  });

  it("GET /me does not leak correct_option", async () => {
    const { text } = await api(
      "GET",
      `/quizzes/${quizCode}/me`,
      undefined,
      participantToken
    );
    expect(hasAnswerLeak(text)).toBe(false);
  });
});
