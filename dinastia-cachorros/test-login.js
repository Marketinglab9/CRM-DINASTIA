const { chromium } = require('playwright');

async function testLogin() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Go to the application
    await page.goto('http://localhost:3000');
    console.log('✅ Homepage loaded');
    
    // Go to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    console.log('✅ Login page loaded');
    
    // Fill in credentials
    await page.fill('input[type="email"]', 'ana.lopez@email.com');
    await page.fill('input[type="password"]', 'client123');
    console.log('✅ Credentials filled');
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log('✅ Login form submitted');
    
    // Wait for redirect
    await page.waitForURL('http://localhost:3000/client', { timeout: 10000 });
    console.log('✅ Redirected to client portal');
    
    // Check if the test page content is visible
    await page.waitForSelector('h1:has-text("Mi Portal - Dinastía Cachorros")');
    console.log('✅ Client dashboard loaded successfully!');
    
    await page.screenshot({ path: 'test-success.png' });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-failure.png' });
  } finally {
    await browser.close();
  }
}

testLogin();