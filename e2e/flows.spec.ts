import { test, expect, type Page } from "@playwright/test";

// Vercel Analytics scripts and /api functions only exist on Vercel, not in `vite preview`
const PLATFORM_ONLY = /\/_vercel\/|\/api\//;

const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // Failed requests are reported below with their URL
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !PLATFORM_ONLY.test(r.url())) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
};

test("home renders without errors", async ({ page }, info) => {
  const errors = collectErrors(page);
  await page.goto("/");
  if (info.project.name === "desktop") {
    await expect(page.locator("#about")).toBeAttached();
    await expect(page.locator("#techstack")).toBeAttached();
  } else {
    await expect(page.getByText("Download CV")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("mobile does not download desktop sections", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(urls.some((u) => u.includes("DesktopSections"))).toBe(false);
});

test("static assets are cache-busted", async ({ page }) => {
  const assets: string[] = [];
  page.on("response", (r) => r.url().includes("/assets/") && assets.push(r.url()));
  await page.goto("/");
  expect(assets.length).toBeGreaterThan(0);
  for (const url of assets) expect(url).toMatch(/-[\w-]{8}\.(js|css)$/);
});

test("projects page lists work", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/myworks");
  await expect(page.locator("img").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("play page loads the chess board", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/play");
  await expect(page.locator("body")).not.toContainText("Something went wrong");
  expect(errors).toEqual([]);
});

test("home page meets a basic load budget", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const js = performance
      .getEntriesByType("resource")
      .filter((r) => r.name.endsWith(".js"))
      .reduce((sum, r) => sum + (r as PerformanceResourceTiming).encodedBodySize, 0);
    return { domContentLoaded: nav.domContentLoadedEventEnd, jsBytes: js };
  });
  expect(timing.domContentLoaded).toBeLessThan(3000);
  // Mobile must not pull in three.js (~140 KB gzip)
  expect(timing.jsBytes).toBeLessThan(400_000);
});
