/**
 * k6 Load Test — Quiz Flow
 *
 * Simulates 300 virtual participants doing a full quiz run alongside 1 host.
 *
 * Usage:
 *   k6 run scripts/loadtest/quiz-flow.k6.js \
 *     -e BASE_URL=http://localhost:3000/api/v1 \
 *     -e HOST_TOKEN=<host-token>
 *
 * Install k6: https://k6.io/docs/getting-started/installation/
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  scenarios: {
    participants: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 300 }, // ramp up
        { duration: "2m", target: 300 },  // hold
        { duration: "30s", target: 0 },   // ramp down
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% of requests under 1s
    http_req_failed: ["rate<0.01"],    // <1% error rate
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000/api/v1";
const QUIZ_CODE = __ENV.QUIZ_CODE;
const HOST_TOKEN = __ENV.HOST_TOKEN;

const NAMES = new SharedArray("names", function () {
  const names = [];
  for (let i = 1; i <= 1000; i++) names.push(`Player_${i}`);
  return names;
});

const OPTIONS = ["A", "B", "C", "D"];

export default function () {
  const name = NAMES[__VU % NAMES.length] + "_" + randomIntBetween(1, 999999);

  // 1. Join the quiz
  const joinRes = http.post(
    `${BASE_URL}/quizzes/${QUIZ_CODE}/join`,
    JSON.stringify({ displayName: name }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(joinRes, { "join 200": (r) => r.status === 200 });
  if (joinRes.status !== 200) return;

  const { token } = joinRes.json();
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  sleep(randomIntBetween(1, 5));

  // 2. Fetch questions
  const qRes = http.get(`${BASE_URL}/quizzes/${QUIZ_CODE}/questions`, {
    headers: authHeaders,
  });
  check(qRes, { "questions 200": (r) => r.status === 200 });
  const questions = qRes.json("questions") ?? [];

  // 3. Answer questions incrementally (simulate human pacing)
  const answers = [];
  for (const q of questions) {
    if (Math.random() < 0.9) {
      // 90% answer rate
      answers.push({
        position: q.position,
        option: OPTIONS[randomIntBetween(0, 3)],
      });
    } else {
      answers.push({ position: q.position, option: null });
    }

    // Debounced save every 3 questions or so
    if (answers.length % 3 === 0) {
      http.put(
        `${BASE_URL}/quizzes/${QUIZ_CODE}/answers`,
        JSON.stringify({ answers }),
        { headers: authHeaders }
      );
    }

    sleep(randomIntBetween(2, 10)); // human think time
  }

  // 4. Submit
  const submitRes = http.post(
    `${BASE_URL}/quizzes/${QUIZ_CODE}/submit`,
    "{}",
    { headers: authHeaders }
  );
  check(submitRes, { "submit 200": (r) => r.status === 200 });

  sleep(randomIntBetween(5, 30));

  // 5. Poll leaderboard a few times
  for (let i = 0; i < 3; i++) {
    const lbRes = http.get(`${BASE_URL}/quizzes/${QUIZ_CODE}/leaderboard`, {
      headers: authHeaders,
    });
    check(lbRes, { "leaderboard 200": (r) => r.status === 200 });
    sleep(10);
  }
}
