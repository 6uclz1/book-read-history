import { expect, test } from "@playwright/test";

test.describe("Book search", () => {
  test("opens from the header and highlights a matching book", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "本を検索" }).click();
    const dialog = page.getByRole("dialog", { name: "本を検索" });
    await expect(dialog).toBeVisible();

    await dialog
      .getByRole("searchbox", { name: "検索キーワード" })
      .fill("反ミーム");

    const resultLink = dialog.getByRole("link", {
      name: "反ミーム部門は存在しない",
    });
    await expect(resultLink).toBeVisible();
    await expect(resultLink.locator("mark")).toHaveText("反ミーム");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
