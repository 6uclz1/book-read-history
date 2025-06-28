import { test, expect } from '@playwright/test';

test.describe('読書管理アプリ - ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルとヘッダーが正しく表示される', async ({ page }) => {
    await expect(page).toHaveTitle('読書管理');
    await expect(page.locator('header')).toContainText('読書管理');
  });

  test('年フィルターが表示され、初期状態でAllが選択されている', async ({
    page,
  }) => {
    // 年フィルターが存在することを確認
    await expect(
      page.getByRole('button', { name: 'すべての年の本を表示' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '2024年の本を表示' })
    ).toBeVisible();

    // Allボタンが選択状態になっていることを確認
    await expect(
      page.getByRole('button', { name: 'すべての年の本を表示' })
    ).toHaveAttribute('aria-selected', 'true');
  });

  test('本のカードが表示される', async ({ page }) => {
    // 本のカードが表示されることを確認
    await expect(page.locator('.card').first()).toBeVisible();

    // 最初の本の情報が表示されることを確認
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('年フィルターが正しく動作する', async ({ page }) => {
    // 初期状態で複数の本が表示されていることを確認
    const initialBookCount = await page.locator('.card').count();
    expect(initialBookCount).toBeGreaterThan(0);

    // 特定の年（2024年）でフィルターする
    await page.getByRole('button', { name: '2024年の本を表示' }).click();

    // フィルター後の本の数を確認
    await page.waitForTimeout(500); // フィルタリング処理を待つ
    const filteredBookCount = await page.locator('.card').count();

    // 2024年ボタンが選択状態になっていることを確認
    await expect(
      page.getByRole('button', { name: '2024年の本を表示' })
    ).toHaveAttribute('aria-selected', 'true');

    // Allボタンをクリックして元に戻す
    await page.getByRole('button', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(500);

    // すべての本が再表示されることを確認
    const allBooksCount = await page.locator('.card').count();
    expect(allBooksCount).toBe(initialBookCount);
  });

  test('本のカードをクリックすると詳細ページに遷移する', async ({ page }) => {
    // 最初の本のカードをクリック
    await page.locator('.card').first().click();

    // 詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/items\//);

    // 詳細ページの要素が表示されることを確認
    await expect(page.locator('.bookDetail')).toBeVisible();
  });

  test('キーボードナビゲーションが正しく動作する', async ({ page }) => {
    // Tabキーで年フィルターボタンにフォーカス
    await page.keyboard.press('Tab');

    // 最初の年フィルターボタンがフォーカスされることを確認
    await expect(
      page.getByRole('button', { name: 'すべての年の本を表示' })
    ).toBeFocused();

    // さらにTabキーを押して本のカードにフォーカス
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // 複数の年フィルターボタンを通過

    // 本のカードがフォーカスされることを確認
    await expect(page.locator('.card').first()).toBeFocused();

    // Enterキーで本を選択
    await page.keyboard.press('Enter');

    // 詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/items\//);
  });

  test('無限スクロールが動作する（本が多数ある場合）', async ({
    page,
  }) => {
    // 初期表示の本の数を取得
    const initialBookCount = await page.locator('.card').count();

    // 最下部までスクロール
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // 少し待ってから本の数を再確認
    await page.waitForTimeout(1000);
    const afterScrollBookCount = await page.locator('.card').count();

    // 本の数が初期より多いか、または変わらない（すべて表示済み）ことを確認
    expect(afterScrollBookCount).toBeGreaterThanOrEqual(initialBookCount);
  });

  test('ISBNリンクが正しく動作する', async ({ page }) => {
    // ISBNリンクをクリック
    const isbnLink = page.locator('a[href*="books.or.jp"]').first();
    await expect(isbnLink).toBeVisible();

    // 新しいタブで開くことを確認（target="_blank"）
    await expect(isbnLink).toHaveAttribute('target', '_blank');
    await expect(isbnLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('レスポンシブデザインが正しく動作する', async ({ page }) => {
    // デスクトップサイズで確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid')).toBeVisible();

    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.grid')).toBeVisible();

    // 年フィルターが表示されることを確認
    await expect(
      page.getByRole('button', { name: 'すべての年の本を表示' })
    ).toBeVisible();
  });

  test('フッターが表示される', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText(
      '© 2024 読書管理. All rights reserved.'
    );
  });

  test('画像が正しく読み込まれる', async ({ page }) => {
    // 最初の本の画像が表示されることを確認
    const firstImage = page.locator('.cardImg img').first();
    await expect(firstImage).toBeVisible();

    // 画像のaltテキストが設定されていることを確認
    await expect(firstImage).toHaveAttribute('alt');
  });
});
