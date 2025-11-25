const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testHomepage() {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (error) {
    console.error('Failed to launch browser:', error.message);
    process.exit(1);
  }

  const results = [];

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'test-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Test 1: Desktop viewport (1920x1080)
  console.log('\n=== Testing Desktop Viewport (1920x1080) ===\n');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const desktopPage = await desktopContext.newPage();

  try {
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait a bit for any dynamic content to load
    await desktopPage.waitForTimeout(3000);

    // Try to dismiss cookie banner if present
    const cookieAcceptButton = await desktopPage.locator('button:has-text("Acceptera alla"), button:has-text("Accept all"), button:has-text("Avvisa alla")').first();
    const cookieButtonVisible = await cookieAcceptButton.isVisible().catch(() => false);
    if (cookieButtonVisible) {
      await cookieAcceptButton.click();
      await desktopPage.waitForTimeout(1000);
    }

    // Check header
    const header = await desktopPage.locator('header').first();
    const headerVisible = await header.isVisible().catch(() => false);
    console.log(`✓ Header visible: ${headerVisible}`);
    results.push({ test: 'Desktop - Header visible', passed: headerVisible });

    if (headerVisible) {
      const headerBox = await header.boundingBox();
      console.log(`  Position: top=${headerBox.y}px, left=${headerBox.x}px`);
    }

    // Check search bar (look for input with placeholder or type="search")
    const searchBar = await desktopPage.locator('input[type="search"], input[placeholder*="ök"], input[placeholder*="search"]').first();
    const searchBarVisible = await searchBar.isVisible().catch(() => false);
    console.log(`✓ Search bar visible: ${searchBarVisible}`);
    results.push({ test: 'Desktop - Search bar visible', passed: searchBarVisible });

    // Check login button or user menu
    const loginButton = await desktopPage.locator('button:has-text("Logga in"), button:has-text("Login"), a:has-text("Logga in"), [aria-label*="user"], [aria-label*="profile"], [aria-label*="menu"]').first();
    const loginVisible = await loginButton.isVisible().catch(() => false);
    console.log(`✓ Login button/user menu visible: ${loginVisible}`);
    results.push({ test: 'Desktop - Login button/user menu visible', passed: loginVisible });

    // Check map loads (look for leaflet container or map div)
    const map = await desktopPage.locator('.leaflet-container, [class*="map"], #map').first();
    const mapVisible = await map.isVisible().catch(() => false);
    console.log(`✓ Map loads correctly: ${mapVisible}`);
    results.push({ test: 'Desktop - Map loads correctly', passed: mapVisible });

    // Check bottom navigation is hidden on desktop
    const bottomNav = await desktopPage.locator('nav[class*="bottom"], [class*="BottomNav"], [class*="bottom-nav"]').first();
    const bottomNavVisible = await bottomNav.isVisible().catch(() => false);
    const bottomNavHidden = !bottomNavVisible;
    console.log(`✓ Bottom navigation hidden (desktop): ${bottomNavHidden}`);
    results.push({ test: 'Desktop - Bottom navigation hidden', passed: bottomNavHidden });

    // Take screenshot
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop-1920x1080.png'),
      fullPage: false
    });
    console.log('\n📸 Desktop screenshot saved: test-screenshots/desktop-1920x1080.png\n');

  } catch (error) {
    console.error('Desktop test error:', error.message);
  }

  await desktopContext.close();

  // Test 2: Mobile viewport (375x667)
  console.log('\n=== Testing Mobile Viewport (375x667) ===\n');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();

  try {
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait a bit for any dynamic content to load
    await mobilePage.waitForTimeout(3000);

    // Try to dismiss cookie banner if present
    const cookieAcceptButton = await mobilePage.locator('button:has-text("Acceptera alla"), button:has-text("Accept all"), button:has-text("Avvisa alla")').first();
    const cookieButtonVisible = await cookieAcceptButton.isVisible().catch(() => false);
    if (cookieButtonVisible) {
      await cookieAcceptButton.click();
      await mobilePage.waitForTimeout(1000);
    }

    // Check header
    const mobileHeader = await mobilePage.locator('header').first();
    const mobileHeaderVisible = await mobileHeader.isVisible().catch(() => false);
    console.log(`✓ Header visible: ${mobileHeaderVisible}`);
    results.push({ test: 'Mobile - Header visible', passed: mobileHeaderVisible });

    // Check bottom navigation
    const mobileBottomNav = await mobilePage.locator('nav[class*="bottom"], [class*="BottomNav"], [class*="bottom-nav"]').first();
    const mobileBottomNavVisible = await mobileBottomNav.isVisible().catch(() => false);
    console.log(`✓ Bottom navigation visible: ${mobileBottomNavVisible}`);
    results.push({ test: 'Mobile - Bottom navigation visible', passed: mobileBottomNavVisible });

    if (mobileBottomNavVisible) {
      // Get z-index and position info
      const bottomNavBox = await mobileBottomNav.boundingBox();
      const bottomNavStyles = await mobileBottomNav.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          zIndex: styles.zIndex,
          position: styles.position,
          bottom: styles.bottom,
          height: el.offsetHeight
        };
      });

      console.log(`  Position: bottom=${bottomNavBox.y}px, height=${bottomNavBox.height}px`);
      console.log(`  Styles: z-index=${bottomNavStyles.zIndex}, position=${bottomNavStyles.position}, bottom=${bottomNavStyles.bottom}`);

      // Check if bottom nav is accessible (not hidden behind map)
      const viewportHeight = 667;
      const isAccessible = bottomNavBox.y + bottomNavBox.height <= viewportHeight;
      console.log(`✓ Bottom navigation accessible (not hidden): ${isAccessible}`);
      results.push({ test: 'Mobile - Bottom navigation accessible', passed: isAccessible });

      // Check for the three tabs
      const tabs = ['Utforska', 'Föreslå', 'Profil'];
      for (const tabText of tabs) {
        const tab = await mobilePage.locator(`span.text-xs:has-text("${tabText}")`).first();
        const tabClickable = await tab.isVisible().catch(() => false);
        console.log(`✓ Tab "${tabText}" clickable: ${tabClickable}`);
        results.push({ test: `Mobile - Tab "${tabText}" clickable`, passed: tabClickable });
      }
    }

    // Check map visibility
    const mobileMap = await mobilePage.locator('.leaflet-container, [class*="map"], #map').first();
    const mobileMapVisible = await mobileMap.isVisible().catch(() => false);
    console.log(`✓ Map visible: ${mobileMapVisible}`);
    results.push({ test: 'Mobile - Map visible', passed: mobileMapVisible });

    if (mobileMapVisible && mobileBottomNavVisible) {
      // Check z-index relationship between map and bottom nav
      const mapBox = await mobileMap.boundingBox();
      const mapStyles = await mobileMap.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          zIndex: styles.zIndex,
          position: styles.position
        };
      });

      const bottomNavStyles = await mobileBottomNav.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          zIndex: styles.zIndex
        };
      });

      console.log(`  Map z-index: ${mapStyles.zIndex}, Bottom nav z-index: ${bottomNavStyles.zIndex}`);

      const mapZIndex = mapStyles.zIndex === 'auto' ? 0 : parseInt(mapStyles.zIndex);
      const bottomNavZIndex = bottomNavStyles.zIndex === 'auto' ? 0 : parseInt(bottomNavStyles.zIndex);
      const correctZIndex = bottomNavZIndex > mapZIndex;

      console.log(`✓ Bottom nav z-index higher than map: ${correctZIndex}`);
      results.push({ test: 'Mobile - Bottom nav z-index > map z-index', passed: correctZIndex });
    }

    // Take screenshot
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, 'mobile-375x667.png'),
      fullPage: false
    });
    console.log('\n📸 Mobile screenshot saved: test-screenshots/mobile-375x667.png\n');

  } catch (error) {
    console.error('Mobile test error:', error.message);
  }

  await mobileContext.close();
  await browser.close();

  // Print summary
  console.log('\n=== Test Summary ===\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.test}`);
    });
  }

  console.log('\nScreenshots saved in: test-screenshots/');
}

testHomepage().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
