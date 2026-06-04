import { chromium, devices } from "@playwright/test";

const pages = [
  ["home", "https://www.zbotglobal.com/"],
  ["faq", "https://www.zbotglobal.com/faq.html"],
  ["about", "https://www.zbotglobal.com/about-us.html"],
  ["service", "https://www.zbotglobal.com/service-ai-strategy.html"],
  ["contact", "https://www.zbotglobal.com/contact.html"],
  ["client-request", "https://www.zbotglobal.com/client-request.html"],
  ["linkedin-campaign", "https://www.zbotglobal.com/zbot-linkedin-landing.html"]
];

const viewports = [
  ["desktop", { viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 }],
  ["mobile", devices["iPhone 13"]]
];

const browser = await chromium.launch({ channel: "chrome" });

for (const [viewportName, options] of viewports) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  for (const [name, url] of pages) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    await page.screenshot({
      path: `tests/artifacts/baseline/${name}-${viewportName}.png`,
      fullPage: true
    });
  }
  await context.close();
}

await browser.close();
