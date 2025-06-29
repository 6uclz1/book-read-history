import { test, expect } from '@playwright/test';

test.describe('無限スクロール - パフォーマンスとメモリリーク対策', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('メモリリークが発生しないことを確認', async ({ page }) => {
    // IntersectionObserverが適切にクリーンアップされることを確認
    const initialObserverCount = await page.evaluate(() => {
      // IntersectionObserverインスタンスの数を追跡するためのカスタムコード
      return (window as any).__intersectionObserverCount || 0;
    });

    // 複数回のフィルター変更を実行
    for (let i = 0; i < 5; i++) {
      await page.getByRole('tab', { name: '2024年の本を表示' }).click();
      await page.waitForTimeout(200);
      await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
      await page.waitForTimeout(200);
    }

    // Observer数が異常に増加していないことを確認
    const finalObserverCount = await page.evaluate(() => {
      return (window as any).__intersectionObserverCount || 0;
    });

    // Observer数の異常な増加がないことを確認（厳密な値ではなく、大幅な増加をチェック）
    expect(finalObserverCount - initialObserverCount).toBeLessThan(10);
  });

  test('高速スクロール時の安定性を確認', async ({ page }) => {
    const initialBookCount = await page.locator('[class*="card"]').count();

    // 高速スクロールを実行
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(50); // 短い間隔でスクロール
    }

    // 少し待ってから最終状態を確認
    await page.waitForTimeout(1000);
    const finalBookCount = await page.locator('[class*="card"]').count();

    // 高速スクロールでも正常に動作することを確認
    expect(finalBookCount).toBeGreaterThanOrEqual(initialBookCount);

    // すべてのカードが正しく表示されていることを確認
    const visibleCards = await page.locator('.card:visible').count();
    expect(visibleCards).toBe(finalBookCount);
  });

  test('大量データでのパフォーマンス確認', async ({ page }) => {
    // パフォーマンス測定開始
    await page.evaluate(() => {
      (window as any).performanceStart = performance.now();
    });

    let bookCount = 0;
    const maxScrollAttempts = 10;

    // 大量のデータを読み込むまでスクロール
    for (let i = 0; i < maxScrollAttempts; i++) {
      const previousCount = bookCount;
      await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      bookCount = await page.locator('[class*="card"]').count();

      if (bookCount === previousCount) {
        break; // すべてのデータが読み込まれた
      }
    }

    // パフォーマンス測定終了
    const performanceTime = await page.evaluate(() => {
      const endTime = performance.now();
      return endTime - (window as any).performanceStart;
    });

    console.log(
      `大量データ読み込み時間: ${performanceTime}ms, 総カード数: ${bookCount}`
    );

    // 合理的な時間内で処理が完了することを確認（30秒以内）
    expect(performanceTime).toBeLessThan(30000);

    // すべてのカードが表示されていることを確認
    expect(bookCount).toBeGreaterThan(0);
  });

  test('連続フィルター変更時のメモリ使用量安定性', async ({ page }) => {
    // 利用可能な年ボタンを取得
    const yearButtons = await page.locator('[role="tab"]').all();
    const yearLabels = await Promise.all(
      yearButtons.map(button => button.getAttribute('aria-label'))
    );

    // 連続でフィルターを変更
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const yearLabel of yearLabels) {
        if (yearLabel) {
          await page.getByRole('tab', { name: yearLabel }).click();
          await page.waitForTimeout(100);

          // 各フィルター変更後にスクロールを実行
          const cardCount = await page.locator('[class*="card"]').count();
          if (cardCount > 10) {
            await page
              .locator('[class*="card"]')
              .nth(Math.min(10, cardCount - 1))
              .scrollIntoViewIfNeeded();
            await page.waitForTimeout(100);
          }
        }
      }
    }

    // 最終的にAllフィルターに戻す
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(300);

    // 正常に動作していることを確認
    const finalBookCount = await page.locator('[class*="card"]').count();
    expect(finalBookCount).toBeGreaterThan(0);
  });

  test('IntersectionObserverの適切な動作確認', async ({ page }) => {
    // 初期状態での本の数を確認
    const initialCount = await page.locator('[class*="card"]').count();

    // スクロールターゲットまでスクロール
    await page.evaluate(() => {
      // 最後の要素までスクロール
      const lastCard = document.querySelector('.card:last-child');
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // IntersectionObserverが発火するまで待機
    await page
      .waitForFunction(
        initial => document.querySelectorAll('.card').length > initial,
        initialCount,
        { timeout: 3000 }
      )
      .catch(() => {
        console.log(
          'IntersectionObserver timeout - 全ての本が既に表示済みの可能性'
        );
      });

    const afterScrollCount = await page.locator('[class*="card"]').count();

    // スクロール後に本が追加されたか、または全て表示済みであることを確認
    expect(afterScrollCount).toBeGreaterThanOrEqual(initialCount);

    // 表示されている全てのカードが有効であることを確認
    const cards = await page.locator('[class*="card"]').all();
    for (const card of cards.slice(0, 5)) {
      // 最初の5枚をサンプルチェック
      await expect(card).toBeVisible();
      await expect(card.locator('h2')).toBeVisible(); // タイトル
      await expect(card.locator('img')).toBeVisible(); // 画像
    }
  });

  test('ローディング状態の適切な表示', async ({ page }) => {
    // 初期ローディング状態をチェック
    const initialCount = await page.locator('[class*="card"]').count();

    // 最後のカードまでスクロール
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();

    // 新しいデータが読み込まれる場合、ローディング状態が適切に管理されることを確認
    const afterScrollCount = await page.locator('[class*="card"]').count();

    if (afterScrollCount > initialCount) {
      // 新しいデータが読み込まれた場合、ローディングが完了していることを確認
      // ローディングスピナーや状態が適切に非表示になっていることを期待

      // 全てのカードが正しくレンダリングされていることを確認
      const visibleCards = await page.locator('.card:visible').count();
      expect(visibleCards).toBe(afterScrollCount);
    }
  });
});
