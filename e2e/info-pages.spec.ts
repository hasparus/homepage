import { expect, test } from "@playwright/test";

test("Contact is a short personal page, not agent or support boilerplate", async ({
  page,
}) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "contact",
  );
  await expect(page.getByRole("main")).toContainText(
    "email: hasparus@gmail.com.",
  );
  await expect(
    page.getByRole("link", { name: "email", exact: true }),
  ).toHaveAttribute("href", "mailto:hasparus@gmail.com");
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", "https://github.com/hasparus");
  await expect(
    page.getByRole("link", { name: "site issues", exact: true }),
  ).toHaveAttribute("href", "https://github.com/hasparus/homepage/issues");
  await expect(page.getByRole("main")).not.toContainText("Agents should");
  await expect(page.getByRole("main")).not.toContainText(
    "without contacting me",
  );
});

test("public documentation does not invent blog service guarantees", async ({
  page,
}) => {
  await page.goto("/docs/");
  await expect(page.getByRole("main")).not.toContainText(
    "service-level agreement",
  );
  await expect(page.getByRole("main")).not.toContainText("rate-limit quota");
  await expect(page.getByRole("main")).not.toContainText(
    "These endpoints only read content.",
  );
});
