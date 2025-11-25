import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function testRestaurantDetail() {
  const browser = await chromium.launch({ headless: true });
  const screenshotsDir = path.join(process.cwd(), 'screenshots');

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Starting restaurant detail page tests...\n');

  // Step 1: Visit homepage to get restaurant URLs
  console.log('Step 1: Visiting homepage to find restaurant URLs...');
  const homePage = await browser.newPage();
  await homePage.setViewportSize({ width: 1920, height: 1080 });

  try {
    await homePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Homepage loaded successfully');

    // Find restaurant links
    const restaurantLinks = await homePage.$$eval('a[href*="/restaurang/"]', (links) =>
      links.map(link => (link as HTMLAnchorElement).href).filter(href => href.includes('/restaurang/'))
    );

    console.log(`Found ${restaurantLinks.length} restaurant links`);
    if (restaurantLinks.length > 0) {
      console.log('First 5 restaurant URLs:', restaurantLinks.slice(0, 5));
    }

    await homePage.close();

    if (restaurantLinks.length === 0) {
      console.log('No restaurant links found on homepage. Will try a direct URL.');
      // Try to navigate to any restaurant page structure
      const testUrl = 'http://localhost:3000/restaurang/test-restaurant';
      console.log(`\nAttempting to test with URL: ${testUrl}\n`);
      await testRestaurantPage(browser, testUrl, screenshotsDir);
    } else {
      // Test the first restaurant found
      const restaurantUrl = restaurantLinks[0];
      console.log(`\nTesting restaurant: ${restaurantUrl}\n`);
      await testRestaurantPage(browser, restaurantUrl, screenshotsDir);
    }

  } catch (error) {
    console.error('Error accessing homepage:', error);
    await homePage.close();

    // Fallback: try a direct restaurant URL
    console.log('\nAttempting fallback test with a sample restaurant URL...\n');
    const fallbackUrl = 'http://localhost:3000/restaurang/sample-restaurant';
    await testRestaurantPage(browser, fallbackUrl, screenshotsDir);
  }

  await browser.close();
  console.log('\nTest completed! Screenshots saved to:', screenshotsDir);
}

async function testRestaurantPage(browser: any, url: string, screenshotsDir: string) {
  const results = {
    desktop: {
      headerVisible: false,
      pageLoaded: false,
      bottomNavHidden: false,
      errors: [] as string[]
    },
    mobile: {
      headerVisible: false,
      headerResponsive: false,
      bottomNavVisible: false,
      bottomNavNotHidden: false,
      allTabsClickable: false,
      clickableTabsCount: 0,
      errors: [] as string[]
    }
  };

  // Test 1: Desktop viewport (1920x1080)
  console.log('=== DESKTOP VIEWPORT TEST (1920x1080) ===');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });

  try {
    await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✓ Desktop page loaded');
    results.desktop.pageLoaded = true;

    // Check header visibility
    const headerSelector = 'header, [role="banner"], nav:first-of-type';
    const header = await desktopPage.$(headerSelector);
    if (header) {
      const isVisible = await header.isVisible();
      results.desktop.headerVisible = isVisible;
      console.log(`✓ Header visible: ${isVisible}`);
    } else {
      console.log('✗ Header not found');
      results.desktop.errors.push('Header element not found');
    }

    // Check bottom navigation is hidden
    const bottomNavSelectors = [
      '[class*="bottom"][class*="nav"]',
      '[class*="bottomNav"]',
      'nav[class*="bottom"]',
      '[data-testid*="bottom-nav"]'
    ];

    let bottomNavFound = false;
    for (const selector of bottomNavSelectors) {
      const bottomNav = await desktopPage.$(selector);
      if (bottomNav) {
        bottomNavFound = true;
        const isHidden = await bottomNav.evaluate((el: HTMLElement) => {
          const style = window.getComputedStyle(el);
          return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
        });
        results.desktop.bottomNavHidden = isHidden;
        console.log(`✓ Bottom navigation hidden: ${isHidden}`);
        break;
      }
    }

    if (!bottomNavFound) {
      console.log('ℹ Bottom navigation not found (might be hidden via CSS/responsive design)');
      results.desktop.bottomNavHidden = true; // Assume it's properly hidden if not in DOM
    }

    // Take screenshot
    const desktopScreenshot = path.join(screenshotsDir, 'desktop-1920x1080.png');
    await desktopPage.screenshot({ path: desktopScreenshot, fullPage: true });
    console.log(`✓ Desktop screenshot saved: ${desktopScreenshot}`);

  } catch (error: any) {
    console.error('✗ Desktop test error:', error.message);
    results.desktop.errors.push(error.message);
  } finally {
    await desktopPage.close();
  }

  console.log('\n=== MOBILE VIEWPORT TEST (375x667) ===');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 667 });

  try {
    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✓ Mobile page loaded');

    // Check header visibility and responsiveness
    const headerSelector = 'header, [role="banner"], nav:first-of-type';
    const header = await mobilePage.$(headerSelector);
    if (header) {
      const isVisible = await header.isVisible();
      results.mobile.headerVisible = isVisible;
      console.log(`✓ Header visible: ${isVisible}`);

      // Check if header is responsive (fits within mobile viewport)
      const headerBox = await header.boundingBox();
      if (headerBox) {
        results.mobile.headerResponsive = headerBox.width <= 375;
        console.log(`✓ Header responsive (width: ${headerBox.width}px): ${results.mobile.headerResponsive}`);
      }
    } else {
      console.log('✗ Header not found');
      results.mobile.errors.push('Header element not found');
    }

    // Check bottom navigation visibility
    const bottomNavSelectors = [
      '[class*="bottom"][class*="nav"]',
      '[class*="bottomNav"]',
      'nav[class*="bottom"]',
      '[data-testid*="bottom-nav"]',
      'nav:last-of-type' // Fallback to last nav element
    ];

    let bottomNav = null;
    for (const selector of bottomNavSelectors) {
      const element = await mobilePage.$(selector);
      if (element) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          bottomNav = element;
          break;
        }
      }
    }

    if (bottomNav) {
      results.mobile.bottomNavVisible = true;
      console.log('✓ Bottom navigation visible: true');

      // Check if bottom nav is not hidden behind content
      const bottomNavBox = await bottomNav.boundingBox();
      if (bottomNavBox) {
        const isNotHidden = bottomNavBox.y + bottomNavBox.height <= 667 + 50; // Allow some margin
        results.mobile.bottomNavNotHidden = isNotHidden;
        console.log(`✓ Bottom navigation not hidden behind content: ${isNotHidden}`);
        console.log(`  Position: y=${bottomNavBox.y}, height=${bottomNavBox.height}, bottom=${bottomNavBox.y + bottomNavBox.height}`);
      }

      // Check all navigation tabs are clickable
      const tabs = await bottomNav.$$('a, button, [role="tab"]');
      console.log(`  Found ${tabs.length} navigation tabs`);

      let clickableCount = 0;
      for (const tab of tabs) {
        const isClickable = await tab.evaluate((el: HTMLElement) => {
          const style = window.getComputedStyle(el);
          return style.pointerEvents !== 'none' && style.visibility !== 'hidden';
        });
        if (isClickable) clickableCount++;
      }

      results.mobile.clickableTabsCount = clickableCount;
      results.mobile.allTabsClickable = clickableCount === tabs.length && tabs.length > 0;
      console.log(`✓ Clickable tabs: ${clickableCount}/${tabs.length}`);

    } else {
      console.log('✗ Bottom navigation not found or not visible');
      results.mobile.errors.push('Bottom navigation not found or not visible');
    }

    // Take screenshot
    const mobileScreenshot = path.join(screenshotsDir, 'mobile-375x667.png');
    await mobilePage.screenshot({ path: mobileScreenshot, fullPage: true });
    console.log(`✓ Mobile screenshot saved: ${mobileScreenshot}`);

  } catch (error: any) {
    console.error('✗ Mobile test error:', error.message);
    results.mobile.errors.push(error.message);
  } finally {
    await mobilePage.close();
  }

  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log('\nDesktop (1920x1080):');
  console.log(`  - Header visible: ${results.desktop.headerVisible ? '✓' : '✗'}`);
  console.log(`  - Page loaded: ${results.desktop.pageLoaded ? '✓' : '✗'}`);
  console.log(`  - Bottom nav hidden: ${results.desktop.bottomNavHidden ? '✓' : '✗'}`);
  if (results.desktop.errors.length > 0) {
    console.log(`  - Errors: ${results.desktop.errors.join(', ')}`);
  }

  console.log('\nMobile (375x667):');
  console.log(`  - Header visible: ${results.mobile.headerVisible ? '✓' : '✗'}`);
  console.log(`  - Header responsive: ${results.mobile.headerResponsive ? '✓' : '✗'}`);
  console.log(`  - Bottom nav visible: ${results.mobile.bottomNavVisible ? '✓' : '✗'}`);
  console.log(`  - Bottom nav not hidden: ${results.mobile.bottomNavNotHidden ? '✓' : '✗'}`);
  console.log(`  - All tabs clickable: ${results.mobile.allTabsClickable ? '✓' : '✗'} (${results.mobile.clickableTabsCount} tabs)`);
  if (results.mobile.errors.length > 0) {
    console.log(`  - Errors: ${results.mobile.errors.join(', ')}`);
  }

  return results;
}

testRestaurantDetail().catch(console.error);
