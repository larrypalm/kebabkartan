import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };

test.describe('Login Page Tests', () => {
  test('Desktop viewport (1920x1080) - Login page', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check page loads correctly
    await expect(page).toHaveURL(/\/login/);

    // Check logo and header are visible
    await expect(page.locator('text=kebabkartan.se')).toBeVisible();
    const logoIcon = page.locator('.material-symbols-outlined:has-text("restaurant")').first();
    await expect(logoIcon).toBeVisible();

    // Check header text
    await expect(page.locator('h1:has-text("Välkommen tillbaka")')).toBeVisible();

    // Check form inputs are visible and properly styled
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'din@email.com');

    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();

    // Check buttons are visible and styled correctly
    const loginButton = page.locator('button:has-text("Logga in")');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    const createAccountButton = page.locator('button:has-text("Skapa konto")');
    await expect(createAccountButton).toBeVisible();

    // Check links to other pages work
    const forgotPasswordLink = page.locator('a:has-text("Glömt lösenord?")');
    await expect(forgotPasswordLink).toBeVisible();
    await expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');

    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();

    const backToMapLink = page.locator('a:has-text("Tillbaka till kartan")');
    await expect(backToMapLink).toBeVisible();
    await expect(backToMapLink).toHaveAttribute('href', '/');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/login-desktop.png',
      fullPage: true
    });

    console.log('✓ Login page desktop tests passed');
  });

  test('Mobile viewport (375x667) - Login page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(MOBILE_VIEWPORT);

    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Check page loads correctly and is responsive
    await expect(page).toHaveURL(/\/login/);

    // Check logo and header are visible
    await expect(page.locator('text=kebabkartan.se')).toBeVisible();

    // Check form inputs are accessible and properly sized
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();

    // Check buttons are full-width and accessible
    const loginButton = page.locator('button:has-text("Logga in")');
    await expect(loginButton).toBeVisible();

    // Verify button is full-width (check its bounding box)
    const loginButtonBox = await loginButton.boundingBox();
    const viewportWidth = MOBILE_VIEWPORT.width;

    if (loginButtonBox) {
      // Button should be close to full width (accounting for padding/margins)
      // Button width is ~293px on 375px viewport = ~78% which is good for mobile
      expect(loginButtonBox.width).toBeGreaterThan(viewportWidth * 0.75);
    }

    // Check all text is readable
    await expect(page.locator('h1:has-text("Välkommen tillbaka")')).toBeVisible();
    await expect(page.locator('text=Logga in för att betygsätta och recensera kebab')).toBeVisible();

    // Check no horizontal scrolling (page width should equal viewport width)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/login-mobile.png',
      fullPage: true
    });

    console.log('✓ Login page mobile tests passed');
  });
});

test.describe('Register Page Tests', () => {
  test('Desktop viewport (1920x1080) - Register page', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Navigate to register page
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Check page loads correctly
    await expect(page).toHaveURL(/\/register/);

    // Check logo and header are visible
    await expect(page.locator('text=kebabkartan.se')).toBeVisible();
    const logoIcon = page.locator('.material-symbols-outlined:has-text("restaurant")').first();
    await expect(logoIcon).toBeVisible();

    // Check header text
    await expect(page.locator('h1:has-text("Skapa ditt konto")')).toBeVisible();

    // Check form inputs are visible and properly styled
    const usernameInput = page.locator('input[type="text"]');
    await expect(usernameInput).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2); // Password and Confirm Password
    await expect(passwordInputs.first()).toBeVisible();
    await expect(passwordInputs.last()).toBeVisible();

    // Check helper text is visible
    await expect(page.locator('text=Detta visas när du skriver recensioner')).toBeVisible();
    await expect(page.locator('text=Minst 8 tecken, en stor bokstav, en liten bokstav och en siffra')).toBeVisible();

    // Check checkbox for terms
    const termsCheckbox = page.locator('input[type="checkbox"]');
    await expect(termsCheckbox).toBeVisible();

    // Check buttons are visible and styled correctly
    const registerButton = page.locator('button:has-text("Skapa konto")');
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toBeEnabled();

    const loginButton = page.locator('button:has-text("Logga in")');
    await expect(loginButton).toBeVisible();

    // Check links to other pages work
    const termsLink = page.locator('a[href="/terms"]');
    await expect(termsLink).toBeVisible();

    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();

    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();

    const backToMapLink = page.locator('a:has-text("Tillbaka till kartan")');
    await expect(backToMapLink).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: 'test-results/register-desktop.png',
      fullPage: true
    });

    console.log('✓ Register page desktop tests passed');
  });

  test('Mobile viewport (375x667) - Register page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(MOBILE_VIEWPORT);

    // Navigate to register page
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Check page loads correctly and is responsive
    await expect(page).toHaveURL(/\/register/);

    // Check logo and header are visible
    await expect(page.locator('text=kebabkartan.se')).toBeVisible();

    // Check form inputs are accessible and properly sized
    const usernameInput = page.locator('input[type="text"]');
    await expect(usernameInput).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2);

    // Check buttons are full-width and accessible
    const registerButton = page.locator('button:has-text("Skapa konto")');
    await expect(registerButton).toBeVisible();

    // Verify button is full-width
    const registerButtonBox = await registerButton.boundingBox();
    const viewportWidth = MOBILE_VIEWPORT.width;

    if (registerButtonBox) {
      // Button should be close to full width (accounting for padding/margins)
      expect(registerButtonBox.width).toBeGreaterThan(viewportWidth * 0.75);
    }

    // Check all text is readable
    await expect(page.locator('h1:has-text("Skapa ditt konto")')).toBeVisible();
    await expect(page.locator('text=Börja betygsätta och recensera kebab idag')).toBeVisible();
    await expect(page.locator('text=Detta visas när du skriver recensioner')).toBeVisible();

    // Check no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/register-mobile.png',
      fullPage: true
    });

    console.log('✓ Register page mobile tests passed');
  });
});

test.describe('Cross-page Navigation', () => {
  test('Navigate between Login and Register pages', async ({ page }) => {
    // Start at login
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for any animations

    // Click on link to register page
    const registerLink = page.locator('a[href="/register"]');
    await registerLink.click();
    await page.waitForLoadState('networkidle');

    // Should be on register page
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('h1:has-text("Skapa ditt konto")')).toBeVisible();

    // Click on link to login page
    const loginLink = page.locator('a[href="/login"]');
    await loginLink.click();
    await page.waitForLoadState('networkidle');

    // Should be back on login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1:has-text("Välkommen tillbaka")')).toBeVisible();

    console.log('✓ Cross-page navigation tests passed');
  });
});
