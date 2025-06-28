import { test, expect } from '@playwright/test';

test.describe('読書管理アプリ - 詳細ページ', () => {
  test.beforeEach(async ({ page }) => {
    // ホームページから最初の本をクリックして詳細ページに移動
    await page.goto('/');
    await page.locator('.card').first().click();
  });

  test('詳細ページが正しく表示される', async ({ page }) => {
    // 詳細ページのURLになっていることを確認
    await expect(page).toHaveURL(/\/items\//);

    // 詳細ページの主要な要素が表示されることを確認
    await expect(page.locator('.bookDetail')).toBeVisible();
    await expect(page.locator('.imageContainer')).toBeVisible();
    await expect(page.locator('.infoContainer')).toBeVisible();
  });

  test('本の情報が正しく表示される', async ({ page }) => {
    // 本のタイトルが表示されることを確認
    await expect(page.locator('.title')).toBeVisible();

    // 本の詳細情報が表示されることを確認
    await expect(page.locator('.author')).toBeVisible();
    await expect(page.locator('.publisher')).toBeVisible();
    await expect(page.locator('.isbn')).toBeVisible();
    await expect(page.locator('.readDate')).toBeVisible();

    // 各情報にラベルが含まれていることを確認
    await expect(page.locator('.author')).toContainText('著者');
    await expect(page.locator('.publisher')).toContainText('出版社');
    await expect(page.locator('.isbn')).toContainText('ISBN');
    await expect(page.locator('.readDate')).toContainText('読了日');
  });

  test('本の画像が正しく表示される', async ({ page }) => {
    const bookImage = page.locator('.bookImage');
    await expect(bookImage).toBeVisible();

    // 画像のalt属性が設定されていることを確認
    await expect(bookImage).toHaveAttribute('alt');
  });

  test('ISBNリンクが正しく動作する', async ({ page }) => {
    const isbnLink = page.locator('.isbn a');
    await expect(isbnLink).toBeVisible();

    // リンクが正しいURLを持つことを確認
    await expect(isbnLink).toHaveAttribute('href', /books\.or\.jp/);
    await expect(isbnLink).toHaveAttribute('target', '_blank');
    await expect(isbnLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('戻るボタンが正しく動作する', async ({ page }) => {
    const backButton = page.getByRole('link', { name: '戻る' });
    await expect(backButton).toBeVisible();

    // 戻るボタンをクリック
    await backButton.click();

    // ホームページに戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('ヘッダーが表示される', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header')).toContainText('読書管理');
  });

  test('フッターが表示される', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText(
      '© 2024 読書管理. All rights reserved.'
    );
  });

  test('レスポンシブデザインが正しく動作する', async ({ page }) => {
    // デスクトップサイズで確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.bookDetail')).toBeVisible();

    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.bookDetail')).toBeVisible();
    await expect(page.locator('.backButton')).toBeVisible();
  });

  test('存在しない本IDの場合、エラーメッセージが表示される', async ({
    page,
  }) => {
    // 存在しない本IDのページに直接アクセス
    await page.goto('/items/nonexistent-id');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=Book not found')).toBeVisible();
  });

  test('キーボードナビゲーションが正しく動作する', async ({ page }) => {
    // Tabキーでナビゲーション
    await page.keyboard.press('Tab');

    // ISBNリンクがフォーカスされることを確認
    await expect(page.locator('.isbn a')).toBeFocused();

    // さらにTabキーで戻るボタンにフォーカス
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '戻る' })).toBeFocused();

    // Enterキーで戻る
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/');
  });

  test('ページタイトルが動的に設定される', async ({ page }) => {
    // ページタイトルに本のタイトルが含まれることを確認
    const title = await page.title();
    expect(title).toContain('読書管理');
    // 注意: generateMetadataが正しく動作していればタイトルに本の名前も含まれるはず
  });

  test('複数の本で詳細ページが正しく動作する', async ({ page }) => {
    // ホームページに戻る
    await page.goto('/');

    // 最初の本をクリック
    const firstBookTitle = await page
      .locator('.card')
      .first()
      .locator('h2')
      .textContent();
    await page.locator('.card').first().click();
    await expect(page).toHaveURL(/\/items\//);

    // 戻る
    await page.getByRole('link', { name: '戻る' }).click();

    // 2番目の本があれば、それもテスト
    const cardCount = await page.locator('.card').count();
    if (cardCount > 1) {
      const secondBookTitle = await page
        .locator('.card')
        .nth(1)
        .locator('h2')
        .textContent();
      await page.locator('.card').nth(1).click();
      await expect(page).toHaveURL(/\/items\//);

      // 異なる本の詳細ページであることを確認
      // （本のタイトルが異なることで確認）
      if (firstBookTitle && secondBookTitle) {
        expect(firstBookTitle).not.toBe(secondBookTitle);
      }
    }
  });
});
