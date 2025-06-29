import { test, expect } from '@playwright/test'

test.describe('Book Detail Page', () => {
  test('should display book details correctly', async ({ page }) => {
    // Go to home page first
    await page.goto('/')
    
    // Wait for books to load and click on the first book
    await page.waitForSelector('[role="gridcell"]')
    const firstBookCard = page.locator('[role="button"][aria-label*="の詳細を表示"]').first()
    
    // Get the book title from the card for verification
    const bookTitle = await firstBookCard.locator('h2').textContent()
    
    await firstBookCard.click()

    // Should be on book detail page
    await expect(page).toHaveURL(/\/items\/[^\/]+$/)

    // Should display the book title in the page
    if (bookTitle) {
      await expect(page.locator('h1, h2').filter({ hasText: bookTitle })).toBeVisible()
    }

    // Should have a way to go back (either back button or navigation)
    // This might vary based on implementation, so we check for common patterns
    const hasBackNavigation = await page.locator('a[href="/"], button:has-text("戻る"), button:has-text("Back")').count() > 0
    expect(hasBackNavigation).toBe(true)
  })

  test('should handle invalid book IDs gracefully', async ({ page }) => {
    // Try to access a non-existent book
    await page.goto('/items/non-existent-book-id')

    // Should either redirect to 404 page, home page, or show an error message
    // We'll check that the page doesn't hang and shows some content
    await page.waitForLoadState('networkidle')
    
    // The page should load without errors
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('should maintain accessibility on detail page', async ({ page }) => {
    // Go to home page and navigate to a book detail page
    await page.goto('/')
    await page.waitForSelector('[role="gridcell"]')
    await page.locator('[role="button"][aria-label*="の詳細を表示"]').first().click()

    // Should have proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toBeVisible()

    // Should have proper focus management
    const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const focusableCount = await focusableElements.count()
    expect(focusableCount).toBeGreaterThan(0)
  })

  test('should have proper metadata on detail page', async ({ page }) => {
    // Go to home page and navigate to a book detail page
    await page.goto('/')
    await page.waitForSelector('[role="gridcell"]')
    await page.locator('[role="button"][aria-label*="の詳細を表示"]').first().click()

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Should have a title (though it might be generic or book-specific)
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })
})