import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');
  
  try {
    // Clean up any test data or resources if needed
    console.log('🗑️ Cleaning up test resources...');
    
    // In a real application, you might:
    // - Clean up test database records
    // - Reset application state
    // - Clear temporary files
    // - Stop additional services
    
    // For this portfolio app, we don't have persistent state to clean up
    // since all APIs are mocked, but we can log the completion
    
    console.log('✅ Global teardown completed successfully!');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;