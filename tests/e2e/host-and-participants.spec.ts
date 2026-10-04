/**
 * E2E test: Host + Participants full flow
 * Multi-context (1 host browser + 3 participant browsers)
 */

import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";

test.describe("Host and Participants — Full Flow", () => {
  let hostPage: Page;
  let quizCode: string;
  const participantPages: Page[] = [];
  const participantContexts: BrowserContext[] = [];

  test.beforeAll(async ({ browser }) => {
    hostPage = await browser.newPage();
  });

  test.afterAll(async () => {
    await hostPage.close();
    for (const ctx of participantContexts) {
      await ctx.close();
    }
  });

  test("host creates a quiz", async () => {
    await hostPage.goto("/");
    await hostPage.getByRole("link", { name: /host/i }).click();
    await hostPage.getByRole("button", { name: /create quiz/i }).click();

    // Wait for the lobby page with the room code
    await expect(hostPage.getByTestId("room-code")).toBeVisible({
      timeout: 15_000,
    });
    quizCode = (await hostPage.getByTestId("room-code").textContent()) ?? "";
    expect(quizCode).toMatch(/^[A-Z]{6}$/);
  });

  test("participants join from mobile viewports", async ({ browser }) => {
    for (let i = 1; i <= 3; i++) {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 }, // iPhone 14
      });
      const page = await ctx.newPage();
      participantContexts.push(ctx);
      participantPages.push(page);

      await page.goto("/join");
      await page.getByLabel(/room code/i).fill(quizCode);
      await page.getByLabel(/display name/i).fill(`Player ${i}`);
      await page.getByRole("button", { name: /join/i }).click();

      // Should land on waiting screen
      await expect(page.getByText(/waiting for host/i)).toBeVisible({
        timeout: 10_000,
      });
    }

    // Host should see 3 participants
    await expect(hostPage.getByTestId("participant-count")).toContainText("3", {
      timeout: 15_000,
    });
  });

  test("host starts the quiz and participants see questions", async () => {
    await hostPage.getByRole("button", { name: /start quiz/i }).click();
    await hostPage.getByRole("button", { name: /confirm/i }).click();

    for (const page of participantPages) {
      await expect(page.getByTestId("question-card")).toBeVisible({
        timeout: 15_000,
      });
    }
  });

  test("participants answer questions and submit", async () => {
    for (const page of participantPages) {
      // Answer all 25 questions by clicking option A each time
      for (let q = 1; q <= 25; q++) {
        const optionA = page.getByTestId(`option-A`);
        if (await optionA.isVisible()) {
          await optionA.click();
        }
        const nextBtn = page.getByRole("button", { name: /next/i });
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
        }
      }

      // Submit
      await page.getByRole("button", { name: /submit/i }).click();
      await page.getByRole("button", { name: /confirm/i }).click();

      await expect(page.getByText(/submitted/i)).toBeVisible({
        timeout: 10_000,
      });
    }
  });

  test("host ends quiz and leaderboard appears", async () => {
    await hostPage.getByRole("button", { name: /end quiz/i }).click();
    await hostPage.getByRole("button", { name: /confirm/i }).click();

    await expect(hostPage.getByTestId("leaderboard")).toBeVisible({
      timeout: 15_000,
    });

    for (const page of participantPages) {
      await expect(page.getByTestId("leaderboard")).toBeVisible({
        timeout: 30_000,
      });
    }
  });
});
