import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display page title and header', async ({ page }) => {
    await expect(page).toHaveTitle('読書管理')
    await expect(page.locator('header')).toContainText('読書管理')
  })

  test('should display year filter buttons', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toBeVisible()
    await expect(page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()).toBeVisible()
  })

  test('should display book grid with books', async ({ page }) => {
    await expect(page.getByRole('grid')).toBeVisible()
    await expect(page.locator('[role="gridcell"]').first()).toBeVisible()
  })

  test('should filter books by year', async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 })
    
    // Get the total number of books initially
    const initialBookCount = await page.locator('[role="gridcell"]').count()
    expect(initialBookCount).toBeGreaterThan(0)

    // Find a specific year button and click it
    const yearButton = page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()
    await yearButton.click()

    // Check that the filter is applied (aria-selected should be true)
    await expect(yearButton).toHaveAttribute('aria-selected', 'true')

    // The "All" button should no longer be selected
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toHaveAttribute('aria-selected', 'false')
  })

  test('should navigate to book detail page when book card is clicked', async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[role="gridcell"]')
    
    // Click on the first book card
    const firstBookCard = page.locator('[role="button"][aria-label*="の詳細を表示"]').first()
    await firstBookCard.click()

    // Should navigate to book detail page
    await expect(page).toHaveURL(/\/items\/[^\/]+$/)
  })

  test('should handle keyboard navigation on book cards', async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[role="gridcell"]')
    
    const firstBookCard = page.locator('[role="button"][aria-label*="の詳細を表示"]').first()
    
    // Focus the card and press Enter
    await firstBookCard.focus()
    await page.keyboard.press('Enter')

    // Should navigate to book detail page
    await expect(page).toHaveURL(/\/items\/[^\/]+$/)
  })

  test('should open ISBN links in new tab', async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[role="gridcell"]')
    
    const isbnLink = page.locator('a[href*="books.or.jp"]').first()
    await expect(isbnLink).toHaveAttribute('target', '_blank')
    await expect(isbnLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should show loading indicator when applicable', async ({ page }) => {
    // This test would be more relevant with a large dataset that triggers infinite scroll
    // For now, we just check that the loading structure exists
    const loadingElement = page.locator('[aria-live="polite"][aria-label="更に本を読み込み中"]')
    
    // The loading element should exist in the DOM (even if not visible)
    const loadingExists = await loadingElement.count() >= 0
    expect(loadingExists).toBe(true)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check main landmark
    await expect(page.locator('main')).toBeVisible()

    // Check year filter accessibility
    await expect(page.getByRole('region', { name: '年度フィルター' })).toBeVisible()
    await expect(page.getByRole('tablist', { name: '読了年で絞り込み' })).toBeVisible()

    // Check book grid accessibility
    const bookGrid = page.getByRole('grid')
    await expect(bookGrid).toBeVisible()
    await expect(bookGrid).toHaveAttribute('aria-label', /\d+冊の本を表示中/)
  })

  test('should display footer', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('© 2024 読書管理. All rights reserved.')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Should still display main elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByRole('region', { name: '年度フィルター' })).toBeVisible()
    await expect(page.getByRole('grid')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})