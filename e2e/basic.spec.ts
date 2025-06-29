import { test, expect } from '@playwright/test';

test.describe('基本テスト', () => {
  test('空のテスト', async ({ page }) => {
    // 何もしない空のテスト
    expect(true).toBe(true);
  });
  
  test('ホームページにアクセスできる', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('読書管理');
  });
  
  test('ページ要素を調査する', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ヘッダーを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
    console.log('Header found');
    
    // CSSクラス名を調査
    const allElements = await page.locator('*').all();
    const classNames = new Set();
    
    for (const element of allElements.slice(0, 50)) { // 最初の50要素をチェック
      const className = await element.getAttribute('class');
      if (className) {
        className.split(' ').forEach(cls => {
          if (cls.trim() && cls.includes('card')) {
            classNames.add(cls.trim());
          }
        });
      }
    }
    
    console.log('Card classes found:', Array.from(classNames));
    
    // カードを探す
    const cardByClass = await page.locator('[class*="card"]').count();
    console.log('Cards found by class pattern:', cardByClass);
    
    // グリッドを探す
    const gridByClass = await page.locator('[class*="grid"]').count();
    console.log('Grid found by class pattern:', gridByClass);
  });
  
  test('基本的な無限スクロールテスト', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 初期表示のカード数を取得
    const initialCards = await page.locator('[class*="card"]').count();
    console.log(`初期カード数: ${initialCards}`);
    
    // カードが表示されていることを確認
    expect(initialCards).toBeGreaterThan(0);
    
    // 最初のカードが表示されていることを確認
    await expect(page.locator('[class*="card"]').first()).toBeVisible();
    
    // 最後のカードまでスクロール
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // スクロール後のカード数を取得
    const afterScrollCards = await page.locator('[class*="card"]').count();
    console.log(`スクロール後カード数: ${afterScrollCards}`);
    
    // カード数が維持または増加していることを確認
    expect(afterScrollCards).toBeGreaterThanOrEqual(initialCards);
  });
  
  test('基本的な年フィルターテスト', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 初期状態でのカード数
    const initialCards = await page.locator('[class*="card"]').count();
    console.log(`初期カード数: ${initialCards}`);
    
    // 2024年フィルターをクリック
    await page.getByRole('tab', { name: '2024年の本を表示' }).click();
    await page.waitForTimeout(500);
    
    // フィルター後のカード数
    const filteredCards = await page.locator('[class*="card"]').count();
    console.log(`2024年フィルター後カード数: ${filteredCards}`);
    
    // フィルターされたカードが表示されていることを確認
    expect(filteredCards).toBeGreaterThan(0);
    
    // Allフィルターに戻す
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(500);
    
    // 元のカード数に戻ることを確認
    const backToAllCards = await page.locator('[class*="card"]').count();
    console.log(`Allフィルター後カード数: ${backToAllCards}`);
    
    expect(backToAllCards).toBe(initialCards);
  });
});