// Set up environment variables for testing
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'

// Mock environment variables
process.env.GOOGLE_PLACES_API_KEY = 'test_google_key'
process.env.TWILIO_SID = 'test_twilio_sid'
process.env.TWILIO_TOKEN = 'test_twilio_token'
process.env.TWILIO_FROM = '+1234567890'
process.env.SENDGRID_API_KEY = 'test_sendgrid_key'
process.env.AMAZON_PA_API_KEYS = 'test_amazon_keys'
process.env.ADMIN_PASSWORD = 'test_admin_password'
process.env.FORMSPREE_URL = 'https://formspree.io/f/test123'
process.env.ENABLE_SCRAPING = 'false'