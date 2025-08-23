// Generate proper Supabase API keys based on the connection info
// Connection: postgresql://postgres.cfzujrnevpaumjlzpwnd:wdGX5I9gfokR6k6w@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

const projectRef = 'cfzujrnevpaumjlzpwnd'
const supabaseUrl = `https://${projectRef}.supabase.co`

// These are example keys - you need to get the real ones from Supabase dashboard
// Go to: https://supabase.com/dashboard/project/cfzujrnevpaumjlzpwnd/settings/api

const exampleKeys = {
  url: supabaseUrl,
  // These are placeholder keys - replace with real ones from dashboard
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.example_anon_key',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.example_service_role_key'
}

console.log('🔑 Supabase Project Information:')
console.log('Project Ref:', projectRef)
console.log('URL:', exampleKeys.url)
console.log('')
console.log('📋 To get your real API keys:')
console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/settings/api')
console.log('2. Copy the "anon public" key')
console.log('3. Copy the "service_role" key')
console.log('4. Update the .env.local file with these keys')
console.log('')
console.log('🔧 Current .env.local should have:')
console.log('NEXT_PUBLIC_SUPABASE_URL=' + exampleKeys.url)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key_here>')
console.log('SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key_here>')

// Test if we can decode the current keys to see project ref
function decodeJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return payload
  } catch (error) {
    return null
  }
}

// Check current keys
require('dotenv').config({ path: '.env.local' })
const currentAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const currentServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('')
console.log('🔍 Analyzing current keys:')

if (currentAnonKey) {
  const anonPayload = decodeJWT(currentAnonKey)
  if (anonPayload) {
    console.log('Anon key project ref:', anonPayload.ref)
    console.log('Anon key role:', anonPayload.role)
    console.log('Anon key expires:', new Date(anonPayload.exp * 1000).toISOString())
  } else {
    console.log('❌ Invalid anon key format')
  }
}

if (currentServiceKey) {
  const servicePayload = decodeJWT(currentServiceKey)
  if (servicePayload) {
    console.log('Service key project ref:', servicePayload.ref)
    console.log('Service key role:', servicePayload.role)
    console.log('Service key expires:', new Date(servicePayload.exp * 1000).toISOString())
  } else {
    console.log('❌ Invalid service key format')
  }
}