/**
 * E2E test: Responsive layout & Accessibility
 *
 * - Checks 360px (narrow Android) layout
 * - Keyboard-only navigation
 * - axe-core accessibility checks
 */

import { test, expect } from "@playwright/test";

// Requires @axe-core/playwright — install with:
//   npm install --save-dev @axe-core/playwright
// Gracefully skip if not installed.
let AxeBuilder: typeof import("@axe-core/playwright").default | null = null;
try {
  AxeBuilder = (await import("@axe-core/playwright")).default;
} catch {
  // axe-core not installed — accessibility checks will be skipped
}

test.describe("Responsive & Accessibility", () => {
  test.use({ viewport: { width: 360, height: 780 } }); // Narrow Android

  test("landing page renders on 360px", async ({ page }) => {
    await page.goto("/");
    // Primary CTA visible on narrow viewport
    await expect(page.getByRole("link", { name: /join/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /host/i })).toBeVisible();

    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("join page renders on 360px", async ({ page }) => {
    await page.goto("/join");
    await expect(page.getByLabel(/room code/i)).toBeVisible();
    await expect(page.getByLabel(/display name/i)).toBeVisible();
  });

  test("landing page is keyboard navigable", async ({ page }) => {
    await page.goto("/");
    // Tab to the first interactive element and press Enter
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test.skip(!AxeBuilder, "axe-core not installed")("landing page passes axe", async ({ page }) => {
    await page.goto("/");
    if (AxeBuilder) {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toHaveLength(0);
    }
  });

  test.skip(!AxeBuilder, "axe-core not installed")("join page passes axe", async ({ page }) => {
    await page.goto("/join");
    if (AxeBuilder) {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toHaveLength(0);
    }
  });
});
