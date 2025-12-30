import { expect, test } from "../fixtures/test";

test("Connect to ethereum provider", async ({ page }) => {
  // Navigate to the homepage
  await page.goto("/", { waitUntil: "commit" });

  // Verify the connected account address
  await page
    .getByRole("heading", {
      name: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    })
    .waitFor({ state: "visible" });

  // Verify the connected account balance
  await expect(page.getByRole("heading", { name: "ETH" })).toHaveText(
    "ETH 10,000.00",
  );

  await expect(page.getByRole("button", { name: /Disconnect/ })).toBeVisible();
});
