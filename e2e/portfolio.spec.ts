import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Nguyễn Công Hiếu/);
    await expect(page.locator('h1')).toContainText('whoami');
  });

  test('should navigate between sections using dock', async ({ page }) => {
    // Test dock navigation
    await page.click('[data-testid="dock-projects"]');
    await expect(page.locator('#projects')).toBeInViewport();

    await page.click('[data-testid="dock-about"]');
    await expect(page.locator('#about')).toBeInViewport();

    await page.click('[data-testid="dock-contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test Alt+1 shortcut for projects
    await page.keyboard.press('Alt+1');
    await expect(page.locator('#projects')).toBeInViewport();

    // Test Alt+2 shortcut for about
    await page.keyboard.press('Alt+2');
    await expect(page.locator('#about')).toBeInViewport();

    // Test Alt+3 shortcut for contact
    await page.keyboard.press('Alt+3');
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('should display projects correctly', async ({ page }) => {
    await page.click('[data-testid="dock-projects"]');
    
    // Wait for projects to load
    await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible();
    
    // Check if projects have required elements
    const projectCards = page.locator('[data-testid="project-card"]');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);

    // Check first project card structure
    const firstCard = projectCards.first();
    await expect(firstCard.locator('h3')).toBeVisible();
    await expect(firstCard.locator('p')).toBeVisible();
  });

  test('should open and close demo modal', async ({ page }) => {
    await page.click('[data-testid="dock-projects"]');
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]');
    
    // Click on a demo button if available
    const demoButton = page.locator('button:has-text("Demo")').first();
    if (await demoButton.isVisible()) {
      await demoButton.click();
      
      // Check if modal opens
      await expect(page.locator('[data-testid="demo-modal"]')).toBeVisible();
      
      // Close modal
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-testid="demo-modal"]')).not.toBeVisible();
    }
  });

  test('should submit contact form', async ({ page }) => {
    await page.click('[data-testid="dock-contact"]');
    
    // Fill out contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible({ timeout: 10000 });
  });

  test('should validate contact form fields', async ({ page }) => {
    await page.click('[data-testid="dock-contact"]');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });

  test('should play/pause music widget', async ({ page }) => {
    const playButton = page.locator('[data-testid="music-play-button"]');
    
    if (await playButton.isVisible()) {
      // Click play button
      await playButton.click();
      
      // Check if button changes to pause
      await expect(page.locator('[data-testid="music-pause-button"]')).toBeVisible();
      
      // Click pause button
      await page.locator('[data-testid="music-pause-button"]').click();
      
      // Check if button changes back to play
      await expect(playButton).toBeVisible();
    }
  });

  test('should toggle music volume', async ({ page }) => {
    const muteButton = page.locator('[data-testid="music-mute-button"]');
    
    if (await muteButton.isVisible()) {
      // Click mute button
      await muteButton.click();
      
      // Check if button changes to unmute
      await expect(page.locator('[data-testid="music-unmute-button"]')).toBeVisible();
      
      // Click unmute button
      await page.locator('[data-testid="music-unmute-button"]').click();
      
      // Check if button changes back to mute
      await expect(muteButton).toBeVisible();
    }
  });

  test('should trigger fox mascot easter egg', async ({ page }) => {
    const foxMascot = page.locator('[data-testid="fox-mascot"]');
    
    if (await foxMascot.isVisible()) {
      // Click on fox mascot
      await foxMascot.click();
      
      // Check if easter egg panel opens
      await expect(page.locator('[data-testid="easter-egg-panel"]')).toBeVisible();
      
      // Close easter egg panel
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-testid="easter-egg-panel"]')).not.toBeVisible();
    }
  });

  test('should download CV when button is clicked', async ({ page }) => {
    await page.click('[data-testid="dock-about"]');
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click CV download button
    const cvButton = page.locator('a:has-text("Tải CV"), a:has-text("Download CV")');
    if (await cvButton.isVisible()) {
      await cvButton.click();
      
      // Wait for download to start
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if page loads correctly on mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if dock is still accessible
    await expect(page.locator('[data-testid="dock"]')).toBeVisible();
    
    // Test navigation on mobile
    await page.click('[data-testid="dock-projects"]');
    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for skip navigation link
    const skipLink = page.locator('a:has-text("Skip to main content")');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveAttribute('href', '#main-content');
    }
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        await expect(img).toHaveAttribute('alt');
      }
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/projects', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.reload();
    
    // Check if error is handled gracefully
    await page.click('[data-testid="dock-projects"]');
    
    // Should show error message or fallback content
    await expect(page.locator('.error-message, .fallback-content')).toBeVisible({ timeout: 10000 });
  });

  test('should load and display all sections', async ({ page }) => {
    // Check if all main sections are present
    await expect(page.locator('#hero')).toBeVisible();
    
    await page.click('[data-testid="dock-projects"]');
    await expect(page.locator('#projects')).toBeVisible();
    
    await page.click('[data-testid="dock-about"]');
    await expect(page.locator('#about')).toBeVisible();
    
    await page.click('[data-testid="dock-contact"]');
    await expect(page.locator('#contact')).toBeVisible();
  });
});