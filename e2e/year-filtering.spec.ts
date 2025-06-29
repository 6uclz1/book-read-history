import { test, expect } from '@playwright/test'

test.describe('Year Filtering Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[role="gridcell"]')
  })

  test('should show all books by default', async ({ page }) => {
    // "All" button should be selected by default
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toHaveAttribute('aria-selected', 'true')

    // Get initial book count
    const initialBookCount = await page.locator('[role="gridcell"]').count()
    expect(initialBookCount).toBeGreaterThan(0)

    // The grid should show the total count
    await expect(page.getByRole('grid')).toHaveAttribute('aria-label', `${initialBookCount}冊の本を表示中`)
  })

  test('should filter books when a specific year is selected', async ({ page }) => {
    const initialBookCount = await page.locator('[role="gridcell"]').count()

    // Find and click a specific year button
    const yearButtons = page.getByRole('tab', { name: /\d{4}年の本を表示/ })
    const firstYearButton = yearButtons.first()
    
    await firstYearButton.click()

    // The year button should now be selected
    await expect(firstYearButton).toHaveAttribute('aria-selected', 'true')

    // "All" button should no longer be selected
    await expect(page.getByRole('tab', { name: 'すべての年の本を表示' })).toHaveAttribute('aria-selected', 'false')

    // The filtered book count should be different (likely fewer)
    const filteredBookCount = await page.locator('[role="gridcell"]').count()
    
    // Update the aria-label check
    await expect(page.getByRole('grid')).toHaveAttribute('aria-label', `${filteredBookCount}冊の本を表示中`)

    // Should still have at least one book (assuming test data has books for each year)
    expect(filteredBookCount).toBeGreaterThan(0)
  })

  test('should return to all books when "All" is clicked after filtering', async ({ page }) => {
    const initialBookCount = await page.locator('[role="gridcell"]').count()

    // Filter by a specific year
    const yearButton = page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()
    await yearButton.click()

    // Wait for filtering to complete
    await page.waitForTimeout(500)
    const filteredBookCount = await page.locator('[role="gridcell"]').count()

    // Click "All" to show all books again
    const allButton = page.getByRole('tab', { name: 'すべての年の本を表示' })
    await allButton.click()

    // "All" should be selected
    await expect(allButton).toHaveAttribute('aria-selected', 'true')

    // Year button should no longer be selected
    await expect(yearButton).toHaveAttribute('aria-selected', 'false')

    // Wait for all books to load again
    await page.waitForTimeout(500)
    
    // Should show all books again (allow for small differences due to infinite scroll)
    const finalBookCount = await page.locator('[role="gridcell"]').count()
    expect(finalBookCount).toBeGreaterThanOrEqual(initialBookCount - 5) // Allow some tolerance
    expect(finalBookCount).toBeLessThanOrEqual(initialBookCount + 5)

    await expect(page.getByRole('grid')).toHaveAttribute('aria-label', `${finalBookCount}冊の本を表示中`)
  })

  test('should switch between different years correctly', async ({ page }) => {
    const yearButtons = page.getByRole('tab', { name: /\d{4}年の本を表示/ })
    const yearButtonCount = await yearButtons.count()

    if (yearButtonCount >= 2) {
      // Click first year
      const firstYearButton = yearButtons.nth(0)
      await firstYearButton.click()
      await expect(firstYearButton).toHaveAttribute('aria-selected', 'true')

      const firstYearBookCount = await page.locator('[role="gridcell"]').count()

      // Click second year
      const secondYearButton = yearButtons.nth(1)
      await secondYearButton.click()
      await expect(secondYearButton).toHaveAttribute('aria-selected', 'true')

      // First year should no longer be selected
      await expect(firstYearButton).toHaveAttribute('aria-selected', 'false')

      const secondYearBookCount = await page.locator('[role="gridcell"]').count()

      // Book counts might be different (unless both years have the same number of books)
      // We just verify that the filtering is working by checking the grid label updates
      await expect(page.getByRole('grid')).toHaveAttribute('aria-label', `${secondYearBookCount}冊の本を表示中`)
    }
  })

  test('should maintain filter state when interacting with books', async ({ page }) => {
    // Filter by a specific year
    const yearButton = page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()
    await yearButton.click()

    // Ensure the filter is applied
    await expect(yearButton).toHaveAttribute('aria-selected', 'true')

    // Click on a book's ISBN link (which should not navigate away due to e.stopPropagation())
    const isbnLink = page.locator('a[href*="books.or.jp"]').first()
    if (await isbnLink.count() > 0) {
      // Create a promise that the popup will appear
      const popupPromise = page.waitForEvent('popup')
      
      // Click the link
      await isbnLink.click()
      
      // Wait for popup and close it
      const popup = await popupPromise
      await popup.close()

      // Should still be on the home page with the filter applied
      await expect(page).toHaveURL('/')
      await expect(yearButton).toHaveAttribute('aria-selected', 'true')
    }
  })

  test('should handle keyboard navigation between filter buttons', async ({ page }) => {
    const allButton = page.getByRole('tab', { name: 'すべての年の本を表示' })
    
    // Focus the "All" button
    await allButton.focus()
    
    // Use Tab to navigate to next filter button
    await page.keyboard.press('Tab')
    
    // Wait a bit for focus to move
    await page.waitForTimeout(100)
    
    // Find the year filter that should have focus
    const yearButton = page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()
    
    // Press Enter to activate the focused filter
    await page.keyboard.press('Enter')
    
    // The button should now be selected
    await expect(yearButton).toHaveAttribute('aria-selected', 'true')
  })

  test('should update URL or maintain state appropriately', async ({ page }) => {
    // This test checks that the app handles routing correctly with filters
    const initialURL = page.url()
    
    // Apply a filter
    const yearButton = page.getByRole('tab', { name: /\d{4}年の本を表示/ }).first()
    await yearButton.click()
    
    // Refresh the page
    await page.reload()
    
    // Should still be functional after reload
    await page.waitForSelector('[role="gridcell"]')
    await expect(page.getByRole('grid')).toBeVisible()
    
    // The app should handle the reload gracefully (whether it maintains filter state or resets)
    const bookCount = await page.locator('[role="gridcell"]').count()
    expect(bookCount).toBeGreaterThan(0)
  })
})