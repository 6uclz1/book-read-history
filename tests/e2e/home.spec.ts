import { expect, test } from "@playwright/test";

const YEAR_FILTER_REGION_LABEL = "年度フィルター";
const ALL_YEARS_LABEL = "すべての年の本を表示";
const YEAR_2015_LABEL = "2015年の本を表示";
const BOOK_TITLE_2015 = "伊藤計劃トリビュート";
const BOOK_2015_READ_DATE = "2015/09/10";

test.describe("Home page", () => {
  test("filters books by year and navigates to the detail page", async ({
    page,
  }) => {
    await page.goto("/");

    const filterRegion = page.getByRole("region", {
      name: YEAR_FILTER_REGION_LABEL,
    });
    await expect(filterRegion).toBeVisible();

    const allFilter = page.getByRole("button", { name: ALL_YEARS_LABEL });
    await expect(allFilter).toHaveAttribute("aria-pressed", "true");

    const gridCells = page.getByRole("listitem");
    await expect(gridCells.first()).toBeVisible();
    const initialCount = await gridCells.count();
    expect(initialCount).toBeGreaterThan(9);

    const year2015Filter = page.getByRole("button", { name: YEAR_2015_LABEL });
    await year2015Filter.click();

    await expect(year2015Filter).toHaveAttribute("aria-pressed", "true");
    await expect(allFilter).toHaveAttribute("aria-pressed", "false");

    await expect(gridCells).toHaveCount(9, { timeout: 15_000 });

    const targetCard = page.getByRole("link", {
      name: new RegExp(BOOK_TITLE_2015),
    });
    await expect(targetCard).toBeVisible();

    await targetCard.click();

    await expect(page).toHaveURL(/\/items\//);
    await expect(
      page.getByRole("heading", { level: 1, name: BOOK_TITLE_2015 }),
    ).toBeVisible();
    await expect(page.getByText(BOOK_2015_READ_DATE)).toBeVisible();

    const backLink = page.getByRole("link", { name: "戻る" });
    await backLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("button", { name: YEAR_2015_LABEL }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(gridCells).toHaveCount(9, { timeout: 15_000 });
  });
});
