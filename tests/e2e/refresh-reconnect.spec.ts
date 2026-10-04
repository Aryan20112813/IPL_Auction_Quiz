/**
 * E2E test: Refresh & Reconnect
 * Verifies a participant can reload mid-quiz and continue from where they left off.
 */

import { test, expect } from "@playwright/test";

test.describe("Refresh & Reconnect", () => {
  // This test depends on a running quiz, so it reads QUIZ_CODE and PARTICIPANT_TOKEN
  // from env variables set up by the CI pipeline or a beforeAll global fixture.
  test.skip(
    !process.env.E2E_QUIZ_CODE,
    "E2E_QUIZ_CODE not set — skipping reconnect test"
  );

  const QUIZ_CODE = process.env.E2E_QUIZ_CODE ?? "";

  test("participant can rejoin after page reload", async ({ page, context }) => {
    // Navigate to the play page
    await page.goto(`/play/${QUIZ_CODE}`);

    // Should be prompted for display name if no session
    if (await page.getByLabel(/display name/i).isVisible()) {
      await page.getByLabel(/display name/i).fill("ReconnectPlayer");
      await page.getByRole("button", { name: /join/i }).click();
    }

    await expect(page.getByTestId("question-card")).toBeVisible({
      timeout: 15_000,
    });

    // Answer a couple of questions
    await page.getByTestId("option-A").click();
    await page.getByRole("button", { name: /next/i }).click();
    await page.getByTestId("option-B").click();

    // Hard reload
    await page.reload();

    // Should still see quiz (token is persisted in localStorage)
    await expect(page.getByTestId("question-card")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("offline answer queue flushes on reconnect", async ({ page, context }) => {
    await page.goto(`/play/${QUIZ_CODE}`);

    // Simulate going offline
    await context.setOffline(true);

    // Attempt an answer (should queue locally)
    const optionBtn = page.getByTestId("option-C");
    if (await optionBtn.isVisible()) {
      await optionBtn.click();
      // Should show offline indicator
      await expect(page.getByTestId("offline-badge")).toBeVisible({
        timeout: 5_000,
      });
    }

    // Come back online
    await context.setOffline(false);

    // Queue should flush — offline indicator should disappear
    await expect(page.getByTestId("offline-badge")).toBeHidden({
      timeout: 15_000,
    });
  });
});
