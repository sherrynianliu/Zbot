import { expect, test } from "@playwright/test";
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("docs/site-route-manifest.json", "utf8"));

for (const route of manifest.filter((item) => item.status !== "excluded")) {
  test(`${route.path} renders without obvious shell breakage`, async ({ page }) => {
    const response = await page.goto(`/${route.path}`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.waitForLoadState("networkidle");
    const preloader = page.locator("#preloader");
    if (await preloader.count()) {
      await expect(preloader).toHaveClass(/is-hidden/);
    }
    expect(errors).toEqual([]);
  });
}
