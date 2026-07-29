import { expect, test } from "@playwright/test";

test.describe("Home page accessibility", () => {
  test("declares Japanese as the document language", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("exposes a skip link as the first focusable element", async ({
    page,
  }) => {
    await page.goto("/");

    // 開発サーバーはオーバーレイ用の要素を差し込むため、Tab の押下順ではなく
    // アプリ内の DOM 順で先頭にあることを検証する
    const firstFocusable = page.locator("#__next a, #__next button").first();
    await expect(firstFocusable).toHaveAttribute("href", "#main-content");

    // 通常は視覚的に隠れており、フォーカス時のみ現れる
    await firstFocusable.focus();
    await expect(firstFocusable).toBeVisible();
    await expect(page.locator("#main-content")).toHaveCount(1);
  });

  test("keeps the ISBN link outside the card link", async ({ page }) => {
    await page.goto("/");

    const firstCard = page.getByRole("listitem").first();

    // div[role=button] にリンクを入れ子にすると、リンク上での Enter が
    // 親のキーハンドラに拾われて別ページへ飛ぶ。素の <a> 同士に保つ。
    await expect(firstCard.locator("[role='button']")).toHaveCount(0);
    await expect(
      firstCard.getByRole("link", { name: /の詳細を表示/ }),
    ).toHaveCount(1);

    const isbnLink = firstCard.getByRole("link", { name: /books\.or\.jp/ });
    await expect(isbnLink).toHaveAttribute("target", "_blank");
    await expect(isbnLink).toHaveAttribute("rel", /noopener/);
  });

  test("shows the visible result count", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/全\d+冊中 \d+冊を表示中/)).toBeVisible();
  });
});
