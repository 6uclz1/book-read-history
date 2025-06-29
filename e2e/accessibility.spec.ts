import { test, expect } from '@playwright/test';

test.describe('読書管理アプリ - アクセシビリティ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ARIAラベルが適切に設定されている', async ({ page }) => {
    // 年フィルターのARIAラベル確認
    await expect(
      page.getByRole('region', { name: '年度フィルター' })
    ).toBeVisible();
    
    await expect(
      page.getByRole('tablist', { name: '読了年で絞り込み' })
    ).toBeVisible();

    // 本のグリッドのARIAラベル確認
    const bookGrid = page.getByRole('grid');
    await expect(bookGrid).toBeVisible();
    
    // グリッドのaria-labelが本の数を含んでいることを確認
    const gridLabel = await bookGrid.getAttribute('aria-label');
    expect(gridLabel).toMatch(/\d+冊の本を表示中/);
  });

  test('キーボードナビゲーションが完全に動作する', async ({ page }) => {
    // Tabキーでナビゲーション開始
    await page.keyboard.press('Tab');
    
    // 最初の年フィルターボタンがフォーカスされる
    await expect(
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeFocused();

    // 矢印キーで年フィルター間を移動（可能な場合）
    await page.keyboard.press('ArrowRight');
    
    // Enterキーでフィルターを選択
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // 選択されたフィルターがaria-selectedを持つことを確認
    const focusedButton = await page.locator(':focus');
    await expect(focusedButton).toHaveAttribute('aria-selected', 'true');

    // Tabキーで本のカードに移動
    for (let i = 0; i < 10; i++) { // 最大10回のTab押下で本のカードに到達
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      const role = await focusedElement.getAttribute('role');
      if (role === 'button' && await focusedElement.locator('.card').count() > 0) {
        break; // 本のカードに到達
      }
    }

    // 本のカードがフォーカスされていることを確認
    const focusedCard = page.locator('.card:focus');
    await expect(focusedCard).toBeVisible();
    
    // Enterキーで詳細ページに移動
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/items\//);
  });

  test('フォーカス管理が適切に行われる', async ({ page }) => {
    // 年フィルターをクリックしてフォーカス確認
    const filterButton = page.getByRole('tab', { name: '2024年の本を表示' });
    await filterButton.click();
    
    // フィルター変更後もボタンがフォーカスを保持することを確認
    await expect(filterButton).toBeFocused();
    
    // 本のカードをクリック
    await page.locator('[class*="card"]').first().click();
    
    // 詳細ページに移動後、戻るボタンをクリック
    await page.getByRole('link', { name: '戻る' }).click();
    
    // ホームページに戻った際にフォーカスが適切に管理されていることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('色覚に配慮したデザインが実装されている', async ({ page }) => {
    // 選択されたボタンと非選択ボタンのスタイル差異を確認
    const selectedButton = page.getByRole('tab', { name: 'すべての年の本を表示' });
    const unselectedButton = page.getByRole('tab', { name: '2024年の本を表示' });
    
    // aria-selected属性で選択状態が明確に示されていることを確認
    await expect(selectedButton).toHaveAttribute('aria-selected', 'true');
    await expect(unselectedButton).toHaveAttribute('aria-selected', 'false');
    
    // CSSクラスも適切に設定されていることを確認
    const selectedClass = await selectedButton.getAttribute('class');
    const unselectedClass = await unselectedButton.getAttribute('class');
    expect(selectedClass).toContain('selectedButton');
    expect(unselectedClass).toContain('button');
    expect(selectedClass).not.toBe(unselectedClass);
  });

  test('スクリーンリーダーに対応した情報が提供されている', async ({ page }) => {
    // 本のカードのaria-labelが詳細情報を含んでいることを確認
    const firstCard = page.locator('[class*="card"]').first();
    const ariaLabel = await firstCard.getAttribute('aria-label');
    
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('の詳細を表示');
    expect(ariaLabel).toContain('著者:');
    
    // 画像のalt属性が設定されていることを確認
    const bookImage = firstCard.locator('img');
    await expect(bookImage).toHaveAttribute('alt');
    
    // ISBNリンクが適切にラベル付けされていることを確認
    const isbnLink = firstCard.locator('a[href*="books.or.jp"]');
    await expect(isbnLink).toBeVisible();
    const linkText = await isbnLink.textContent();
    expect(linkText).toBeTruthy();
  });

  test('高コントラストモードでの表示確認', async ({ page }) => {
    // 強制的に高コントラストモードを有効化（可能な場合）
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // 主要な要素が表示されることを確認
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('[class*="grid"]')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toBeVisible();
    
    // 本のカードが表示されることを確認
    await expect(page.locator('[class*="card"]').first()).toBeVisible();
    
    // 通常モードに戻す
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('[class*="grid"]')).toBeVisible();
  });

  test('ズーム機能での表示確認', async ({ page }) => {
    // 200%ズーム
    await page.setViewportSize({ width: 600, height: 400 });
    await expect(page.locator('[class*="grid"]')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toBeVisible();
    
    // 本のカードが表示されることを確認
    const cardCount = await page.locator('[class*="card"]').count();
    expect(cardCount).toBeGreaterThan(0);
    
    // スクロールが正常に動作することを確認
    if (cardCount > 5) {
      await page.locator('[class*="card"]').nth(4).scrollIntoView();
      await page.waitForTimeout(300);
      await expect(page.locator('[class*="card"]').nth(4)).toBeVisible();
    }
  });

  test('言語設定への対応確認', async ({ page }) => {
    // 日本語コンテンツが適切に表示されることを確認
    await expect(page.locator('header')).toContainText('読書管理');
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toBeVisible();
    
    // HTML lang属性が設定されていることを確認
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ja');
  });

  test('セマンティックHTML構造の確認', async ({ page }) => {
    // 適切なHeading階層が存在することを確認
    await expect(page.locator('h1')).toBeVisible();
    
    // メインコンテンツ領域が存在することを確認
    await expect(page.locator('main')).toBeVisible();
    
    // ナビゲーション要素が適切に構造化されていることを確認
    const filterRegion = page.getByRole('region', { name: '年度フィルター' });
    await expect(filterRegion).toBeVisible();
    
    // リスト構造が適切に使用されていることを確認（グリッド表示）
    const grid = page.getByRole('grid');
    await expect(grid).toBeVisible();
    
    const gridCells = page.getByRole('gridcell');
    const cellCount = await gridCells.count();
    expect(cellCount).toBeGreaterThan(0);
  });
});