import { expect, test } from "@playwright/test";
import { routes } from "./global-setup";

/*
 * Every page: loads, has one h1, unique metadata and a canonical URL, and
 * logs no errors. Plus SEO files, headers, the 404 and the hero states.
 */

for (const route of routes) {
  test(`${route} renders with metadata and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(/Clynera Tech/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(40);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(route === "/" ? "/" : route);
    expect(errors).toEqual([]);
  });
}

test("private identifiers are never published", async ({ request }) => {
  for (const route of routes) {
    const html = await (await request.get(route)).text();
    for (const secret of ["432761610", "43-2761610", "3109213"]) expect(html, `${route} contains ${secret}`).not.toContain(secret);
  }
});

test("unknown pages return the designed 404", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Dead end." })).toBeVisible();
});

test("renamed pages redirect to their new homes", async ({ request }) => {
  const about = await request.get("/company", { maxRedirects: 0 });
  expect(about.status()).toBe(308);
  expect(about.headers()["location"]).toBe("/about");
  const article = await request.get("/insights/why-ai-projects-stall-before-production", { maxRedirects: 0 });
  expect(article.status()).toBe(308);
  expect(article.headers()["location"]).toBe("/insights");
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["strict-transport-security"]).toContain("max-age=");
});

test("sitemap and robots list the public pages", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/capabilities", "/careers/jobs", "/about", "/insights/hire-for-the-problem-not-the-stack"]) expect(sitemap).toContain(p);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api/");
});

test("structured data describes the organization", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const org = blocks.map((b) => JSON.parse(b)).find((b) => b["@type"] === "Organization");
  expect(org).toMatchObject({ legalName: "Clynera Tech LLC", email: "hr@clyneratech.com", address: { postalCode: "75247" } });
});

test("hero starts dormant and wakes on a key press", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("[data-hero]");
  // The heading is readable by assistive technology even before the system wakes.
  await expect(page.getByRole("heading", { level: 1, name: "We find the way through." })).toBeAttached();
  await expect(hero).toHaveAttribute("data-hero", "dormant");
  await page.keyboard.press("Shift");
  await expect(hero).toHaveAttribute("data-hero", "awake");
});

test("hero wakes on its own if the visitor does nothing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-hero]")).toHaveAttribute("data-hero", "awake", { timeout: 8000 });
});

test("reduced motion skips the dormant state", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-awake", "");
  await expect(page.getByRole("link", { name: "About Clynera", exact: true })).toBeVisible();
  await ctx.close();
});

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard journey");
  await page.goto("/about");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone navigation");
  await page.goto("/about");
  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await menu.getByRole("link", { name: /Capabilities/ }).click();
  await expect(page).toHaveURL(/\/capabilities$/);
  await expect(menu).toBeHidden();
});

test("no page scrolls sideways on a phone", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone layout");
  for (const route of routes) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
});
