import { test, expect, type Page } from "@playwright/test";
test.setTimeout(120000);
const swipe = async (page: Page) => {
  const c = await page.context().newCDPSession(page);
  for (let i = 0; i < 3; i++) {
    await c.send("Input.synthesizeScrollGesture", { x: 200, y: 600, yDistance: -500, speed: 1500, gestureSourceType: "touch" });
  }
  await page.waitForTimeout(1000);
  return page.evaluate(() => ({ y: scrollY, h: document.documentElement.scrollHeight, bodyOv: getComputedStyle(document.body).overflowY }));
};
for (const missing of [false, true]) {
  test(`mobile scroll (initialFX ${missing ? "missing" : "ok"})`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile");
    if (missing) await page.route(/initialFX-.*\.js/, (r) => r.fulfill({ status: 404, body: "" }));
    let loads = 0; page.on("load", () => loads++);
    await page.goto("/");
    await page.waitForTimeout(4000);
    const r = await swipe(page);
    console.log(`MOBILE missing=${missing}`, JSON.stringify(r), "loads", loads);
    expect(r.y).toBeGreaterThan(100);
  });
}
test("tablet 900px scroll", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1200 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4173/");
  await page.waitForTimeout(4000);
  const r = await swipe(page);
  console.log("TABLET", JSON.stringify(r)); expect(r.y).toBeGreaterThan(100);
  await ctx.close();
});
