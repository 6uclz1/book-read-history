import { test, expect } from '@playwright/test';

test.describe('デバッグ用テスト', () => {
  test('ページの状態をデバッグ', async ({ page }) => {
    await page.goto('/');

    // ページが読み込まれるまで待機
    await page.waitForLoadState('networkidle');

    // スクリーンショットを撮影
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });

    // ページの内容をログ出力
    const title = await page.title();
    console.log('Page title:', title);

    const html = await page.locator('body').innerHTML();
    console.log('Body HTML length:', html.length);

    // 主要な要素の存在確認
    const header = await page.locator('header').count();
    console.log('Header count:', header);

    const main = await page.locator('main').count();
    console.log('Main count:', main);

    const cards = await page.locator('.card').count();
    console.log('Card count:', cards);

    const grid = await page.locator('.grid').count();
    console.log('Grid count:', grid);

    // CSS classes の確認
    const allClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const classes = new Set();
      elements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls.trim()) classes.add(cls.trim());
          });
        }
      });
      return Array.from(classes).sort();
    });

    console.log('Available CSS classes:', allClasses.slice(0, 20));

    // エラーログの確認
    const errors = await page.evaluate(() => {
      return [];
    });
    console.log('Console errors:', errors);
  });
});
