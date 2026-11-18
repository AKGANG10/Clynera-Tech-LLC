import { expect, test } from "@playwright/test";

/*
 * The interactive parts of the experience: each works by mouse, keyboard and
 * touch, and the contact form never reports a false success.
 */

test("capability map changes the environment by click and arrow keys", async ({ page, isMobile }) => {
  await page.goto("/capabilities");
  const tablist = page.getByRole("tablist", { name: "Capabilities" });
  const panel = page.getByRole("tabpanel");
  await expect(tablist.getByRole("tab", { name: "AI" })).toHaveAttribute("aria-selected", "true");
  await tablist.getByRole("tab", { name: "Cloud" }).click();
  await expect(panel.getByRole("heading", { name: "Cloud", exact: true })).toBeVisible();
  if (!isMobile) {
    await tablist.getByRole("tab", { name: "Cloud" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tablist.getByRole("tab", { name: "Data" })).toBeFocused();
    await expect(panel.getByRole("heading", { name: "Data", exact: true })).toBeVisible();
    await page.keyboard.press("End");
    await expect(panel.getByRole("heading", { name: "Digital experience" })).toBeVisible();
  }
});

test("the human network follows any selected point", async ({ page }) => {
  await page.goto("/people");
  const network = page.getByRole("button", { name: "SQL" });
  await network.click();
  await expect(network).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Specialist 1 brings Java and SQL")).toBeVisible();
  await expect(page.getByText("Specialist 3 brings TypeScript and SQL")).toBeVisible();
  await expect(page.getByText("Example routes, not real candidates")).toBeVisible();
});

test("concept work is labelled as concept, not client work", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByText("Concept, not client work")).toBeVisible();
});

test("contact form explains what is missing", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact Clynera Tech" });
  await page.waitForTimeout(300);
  await form.getByRole("button", { name: "Send my message" }).click();
  const alert = form.getByRole("alert");
  await expect(alert).toContainText("Enter your name.");
  await expect(alert).toContainText("Enter a valid email address.");
  await expect(form.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
});

test("a technology inquiry is accepted with a reference", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact Clynera Tech" });
  await form.getByLabel("Full name").fill("Form Tester");
  await form.getByLabel("Work email").fill(`form-${Date.now()}@example.com`);
  await form.getByLabel("What are you trying to build or fix?").fill("A customer portal connected to our existing billing system.");
  await page.waitForTimeout(2700);
  await form.getByRole("button", { name: "Send my message" }).click();
  const done = page.getByRole("status");
  await expect(done).toContainText("Thanks, Form.");
  await expect(done).toContainText(/Reference CT-[A-Z0-9]{8}/);
});

test("careers links open the careers form and require consent", async ({ page }) => {
  await page.goto("/contact?topic=careers");
  const form = page.getByRole("form", { name: "Contact Clynera Tech" });
  await expect(form.getByRole("radio", { name: /Careers/ })).toBeChecked();
  await form.getByLabel("Full name").fill("Career Tester");
  await form.getByLabel(/^Email/).fill(`career-${Date.now()}@example.com`);
  await form.getByLabel("Location").fill("Dallas, TX");
  await form.getByLabel("Roles you are interested in").fill("Data engineer");
  await form.getByLabel("Your main skills").fill("Python, SQL, AWS");
  await form.getByRole("button", { name: "Send my message" }).click();
  await expect(form.getByRole("alert")).toContainText("privacy notice");
});

test("careers leads to a job search with an honest empty state", async ({ page }) => {
  await page.goto("/careers");
  await page.getByRole("main").getByRole("link", { name: /Search jobs|open role/ }).first().click();
  await expect(page).toHaveURL(/\/careers\/jobs$/);
  const search = page.getByRole("search", { name: "Search jobs" });
  await expect(search.getByLabel("Keyword")).toBeVisible();
  await search.getByLabel("Keyword").fill("engineer");
  await expect(page.getByRole("status")).toContainText("No open roles listed right now");
  await expect(page.getByRole("main").getByRole("link", { name: "Join the talent network" })).toBeVisible();
});

test("articles open from the insights index", async ({ page }) => {
  await page.goto("/insights");
  await page.getByRole("link", { name: "Hire for the problem, not the stack" }).click();
  await expect(page).toHaveURL(/\/insights\/hire-for-the-problem-not-the-stack$/);
  await expect(page.getByRole("heading", { level: 1, name: "Hire for the problem, not the stack" })).toBeVisible();
});

test("every page ends with the signature finale", async ({ page }) => {
  await page.goto("/about");
  const finale = page.getByRole("heading", { name: "There is always a way out." });
  await finale.scrollIntoViewIfNeeded();
  await expect(finale).toBeVisible();
  await expect(page.locator("[data-finale]")).toHaveAttribute("data-finale", "done", { timeout: 10_000 });
});
