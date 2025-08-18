import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    console.log('⏳ Waiting for dev server to be ready...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Check if the page loads correctly
    await page.waitForSelector('h1', { timeout: 30000 });
    console.log('✅ Dev server is ready!');
    
    // Pre-warm the API endpoints
    console.log('🔥 Pre-warming API endpoints...');
    
    // Test projects API
    const projectsResponse = await page.request.get('/api/projects');
    if (projectsResponse.ok()) {
      console.log('✅ Projects API is ready');
    } else {
      console.warn('⚠️ Projects API returned:', projectsResponse.status());
    }
    
    // Test contact API with a dummy request
    const contactResponse = await page.request.post('/api/contact', {
      data: {
        name: 'Test Setup',
        email: 'setup@test.com',
        subject: 'Setup Test',
        message: 'This is a setup test message'
      }
    });
    
    if (contactResponse.ok()) {
      console.log('✅ Contact API is ready');
    } else {
      console.warn('⚠️ Contact API returned:', contactResponse.status());
    }
    
    // Test demo APIs
    const gmapsResponse = await page.request.get('/api/demo/gmaps-search?q=test');
    if (gmapsResponse.ok()) {
      console.log('✅ Google Maps demo API is ready');
    }
    
    const tradeResponse = await page.request.get('/api/demo/trade-report?symbol=AAPL');
    if (tradeResponse.ok()) {
      console.log('✅ Trade report demo API is ready');
    }
    
    console.log('🎉 Global setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;