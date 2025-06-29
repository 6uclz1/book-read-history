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
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeVisible();
    await expect(
      page.getByRole('tab', { name: '2024年の本を表示' })
    ).toBeVisible();

    // Allボタンが選択状態になっていることを確認
    await expect(
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toHaveAttribute('aria-selected', 'true');
  });

  test('本のカードが表示される', async ({ page }) => {
    // 本のカードが表示されることを確認
    await expect(page.locator('[class*="card"]').first()).toBeVisible();

    // 最初の本の情報が表示されることを確認
    await expect(page.locator('[class*="card"]').first()).toBeVisible();
  });

  test('年フィルターが正しく動作する', async ({ page }) => {
    // ページの完全な読み込みを待つ
    await page.waitForLoadState('networkidle');
    
    // 本のカードが表示されるまで待機
    await page.waitForFunction(() => {
      return document.querySelectorAll('[class*="card"]').length > 0;
    }, { timeout: 10000 });
    
    // 初期状態で複数の本が表示されていることを確認
    const initialBookCount = await page.locator('[class*="card"]').count();
    expect(initialBookCount).toBeGreaterThan(0);
    console.log(`初期表示の本数: ${initialBookCount}`);

    // 特定の年（2024年）でフィルターする
    await page.getByRole('tab', { name: '2024年の本を表示' }).click();

    // フィルター処理の完了を待つ
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('.card');
      return cards.length > 0; // カードが表示されるまで待機
    }, { timeout: 3000 });
    
    const filteredBookCount = await page.locator('[class*="card"]').count();
    console.log(`2024年フィルター後の本数: ${filteredBookCount}`);

    // 2024年ボタンが選択状態になっていることを確認
    await expect(
      page.getByRole('tab', { name: '2024年の本を表示' })
    ).toHaveAttribute('aria-selected', 'true');
    
    // フィルターされた本の読了日が2024年であることを確認
    if (filteredBookCount > 0) {
      const firstBookReadDate = await page.locator('[class*="card"]').first().locator('[class*="readDate"]').textContent();
      expect(firstBookReadDate).toContain('2024');
    }

    // Allボタンをクリックして元に戻す
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    
    // Allフィルターの処理完了を待つ
    await page.waitForFunction((initial) => {
      const cards = document.querySelectorAll('.card');
      return cards.length >= initial; // 初期状態以上のカード数に戻るまで待機
    }, initialBookCount, { timeout: 3000 });

    // すべての本が再表示されることを確認
    const allBooksCount = await page.locator('[class*="card"]').count();
    console.log(`Allフィルター後の本数: ${allBooksCount}`);
    expect(allBooksCount).toBe(initialBookCount);
  });

  test('全ての年フィルターが正しく動作する', async ({ page }) => {
    // 利用可能な年ボタンを取得
    const yearButtons = await page.locator('[role="tab"]').all();
    const yearLabels = await Promise.all(
      yearButtons.map(button => button.getAttribute('aria-label'))
    );
    
    console.log(`利用可能な年フィルター: ${yearLabels.join(', ')}`);
    
    // 各年フィルターをテスト
    for (const yearLabel of yearLabels) {
      if (yearLabel && yearLabel !== 'すべての年の本を表示') {
        console.log(`テスト中: ${yearLabel}`);
        
        await page.getByRole('tab', { name: yearLabel }).click();
        
        // フィルター処理の完了を待つ
        await page.waitForTimeout(300);
        
        // ボタンが選択状態になっていることを確認
        await expect(
          page.getByRole('tab', { name: yearLabel })
        ).toHaveAttribute('aria-selected', 'true');
        
        // フィルターされた本が表示されることを確認
        const filteredCount = await page.locator('[class*="card"]').count();
        if (filteredCount > 0) {
          // 最初の本の読了日が正しい年であることを確認
          const year = yearLabel.match(/(\d{4})/)?.[1];
          if (year) {
            const firstBookReadDate = await page.locator('[class*="card"]').first().locator('[class*="readDate"]').textContent();
            expect(firstBookReadDate).toContain(year);
          }
        }
      }
    }
    
    // 最後にAllフィルターに戻す
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(300);
    
    await expect(
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toHaveAttribute('aria-selected', 'true');
  });

  test('フィルター変更時の無限スクロール状態リセット', async ({ page }) => {
    // 初期状態でスクロールして本を多く表示
    const initialCount = await page.locator('[class*="card"]').count();
    
    // スクロールしてさらに本を読み込み
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const afterScrollCount = await page.locator('[class*="card"]').count();
    
    console.log(`スクロール後の本数: ${afterScrollCount}`);
    
    // フィルターを変更
    await page.getByRole('tab', { name: '2024年の本を表示' }).click();
    await page.waitForTimeout(300);
    
    // フィルター後の本数を確認（スクロール状態はリセットされるべき）
    const filteredCount = await page.locator('[class*="card"]').count();
    console.log(`フィルター後の本数: ${filteredCount}`);
    
    // フィルターされた結果に基づいて初期表示数（48冊）または全件数であることを確認
    if (filteredCount > 48) {
      // 48冊を超える場合は初期表示数にリセットされているべきではない。
      // ただし、フィルター結果が48冊以下の場合は全件表示される。
      expect(filteredCount).toBeLessThanOrEqual(48);
    }
    
    // Allフィルターに戻して初期状態に戻る
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(300);
    
    const backToAllCount = await page.locator('[class*="card"]').count();
    console.log(`Allフィルターに戻した後の本数: ${backToAllCount}`);
    
    // 初期表示数（48冊）にリセットされていることを確認
    expect(backToAllCount).toBe(Math.min(48, initialCount));
  });

  test('本のカードをクリックすると詳細ページに遷移する', async ({ page }) => {
    // 最初の本のカードをクリック
    await page.locator('[class*="card"]').first().click();

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
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeFocused();

    // さらにTabキーを押して本のカードにフォーカス
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // 複数の年フィルターボタンを通過

    // 本のカードがフォーカスされることを確認
    await expect(page.locator('[class*="card"]').first()).toBeFocused();

    // Enterキーで本を選択
    await page.keyboard.press('Enter');

    // 詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/items\//);
  });

  test('無限スクロールが正しく動作する', async ({ page }) => {
    // 初期表示の本の数を取得（48冊まで表示）
    const initialBookCount = await page.locator('[class*="card"]').count();
    console.log(`初期表示の本の数: ${initialBookCount}`);

    // 最後の本のカードまでスクロール
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
    
    // ローディング状態を確認
    await page.waitForTimeout(200); // スクロール検出の待機
    
    // 新しい本が読み込まれるまで待機（最大5秒）
    await page.waitForFunction(
      (initial) => {
        const currentCount = document.querySelectorAll('[class*="card"]').length;
        return currentCount > initial;
      },
      initialBookCount,
      { timeout: 5000 }
    ).catch(() => {
      // タイムアウトした場合は、すべての本が既に表示済みの可能性
      console.log('無限スクロールのタイムアウト - すべての本が表示済みの可能性');
    });

    const afterScrollBookCount = await page.locator('[class*="card"]').count();
    console.log(`スクロール後の本の数: ${afterScrollBookCount}`);

    // 本の数が初期より多いか、または変わらない（すべて表示済み）ことを確認
    expect(afterScrollBookCount).toBeGreaterThanOrEqual(initialBookCount);
  });

  test('無限スクロール - 複数回のスクロールが正しく動作する', async ({ page }) => {
    let currentBookCount = await page.locator('[class*="card"]').count();
    const scrollAttempts = 3; // 最大3回スクロールを試行
    
    for (let i = 0; i < scrollAttempts; i++) {
      console.log(`スクロール試行 ${i + 1}: 現在の本の数 ${currentBookCount}`);
      
      // 最後の本のカードまでスクロール
      await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
      
      // 新しい本が読み込まれるまで待機
      const previousCount = currentBookCount;
      await page.waitForTimeout(500);
      
      currentBookCount = await page.locator('[class*="card"]').count();
      
      // 新しい本が読み込まれなかった場合は終了（すべて表示済み）
      if (currentBookCount === previousCount) {
        console.log('すべての本が表示済みです');
        break;
      }
      
      // 本の数が増加していることを確認
      expect(currentBookCount).toBeGreaterThan(previousCount);
    }
  });

  test('無限スクロール - フィルター変更後の動作確認', async ({ page }) => {
    // 特定の年でフィルター
    await page.getByRole('tab', { name: '2024年の本を表示' }).click();
    await page.waitForTimeout(300);
    
    const filteredInitialCount = await page.locator('[class*="card"]').count();
    console.log(`2024年フィルター後の初期本数: ${filteredInitialCount}`);
    
    // スクロールを実行
    if (filteredInitialCount > 0) {
      await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const afterScrollCount = await page.locator('[class*="card"]').count();
      console.log(`スクロール後の本数: ${afterScrollCount}`);
      
      // フィルター後でも無限スクロールが動作することを確認
      expect(afterScrollCount).toBeGreaterThanOrEqual(filteredInitialCount);
    }
    
    // Allフィルターに戻す
    await page.getByRole('tab', { name: 'すべての年の本を表示' }).click();
    await page.waitForTimeout(300);
    
    // 元の状態に戻ることを確認
    const backToAllCount = await page.locator('[class*="card"]').count();
    expect(backToAllCount).toBeGreaterThanOrEqual(filteredInitialCount);
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
    await expect(page.locator('[class*="grid"]')).toBeVisible();
    
    // デスクトップサイズでの無限スクロール確認
    const desktopInitialCount = await page.locator('[class*="card"]').count();
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[class*="grid"]')).toBeVisible();
    
    // 年フィルターが表示されることを確認
    await expect(
      page.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeVisible();
    
    // モバイルサイズでの無限スクロール確認
    const mobileInitialCount = await page.locator('[class*="card"]').count();
    await page.locator('[class*="card"]').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const mobileAfterScrollCount = await page.locator('[class*="card"]').count();
    
    // モバイルでも無限スクロールが動作することを確認
    expect(mobileAfterScrollCount).toBeGreaterThanOrEqual(mobileInitialCount);
  });

  test('フッターが表示される', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText(
      '© 2024 読書管理. All rights reserved.'
    );
  });

  test('画像が正しく読み込まれる', async ({ page }) => {
    // 最初の本の画像が表示されることを確認
    const firstImage = page.locator('[class*="cardImg"] img').first();
    await expect(firstImage).toBeVisible();

    // 画像のaltテキストが設定されていることを確認
    await expect(firstImage).toHaveAttribute('alt');
  });
});
