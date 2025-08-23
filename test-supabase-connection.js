require('dotenv').config({ path: '.env.local' })
const https = require('https')
const http = require('http')
const { URL } = require('url')

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    console.log('📡 Supabase URL:', supabaseUrl)
    console.log('🔑 Anon Key:', supabaseKey.substring(0, 20) + '...')
    
    // Test 1: Basic HTTP request to Supabase
    console.log('\n🌐 Test 1: Basic HTTP connection...')
    const url = new URL(supabaseUrl)
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    }
    
    const client = url.protocol === 'https:' ? https : http
    
    const testRequest = () => {
      return new Promise((resolve, reject) => {
        const req = client.request(options, (res) => {
          console.log('✅ HTTP Status:', res.statusCode)
          console.log('📋 Headers:', JSON.stringify(res.headers, null, 2))
          
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })
          
          res.on('end', () => {
            console.log('📄 Response:', data.substring(0, 200) + '...')
            resolve({ status: res.statusCode, data })
          })
        })
        
        req.on('error', (error) => {
          console.error('❌ Request error:', error.message)
          reject(error)
        })
        
        req.setTimeout(10000, () => {
          console.error('❌ Request timeout')
          req.destroy()
          reject(new Error('Request timeout'))
        })
        
        req.end()
      })
    }
    
    await testRequest()
    
    // Test 2: Test with fetch (if available)
    console.log('\n🔄 Test 2: Using fetch API...')
    try {
      const fetch = (await import('node-fetch')).default
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })
      
      console.log('✅ Fetch Status:', response.status)
      console.log('📋 Fetch Headers:', JSON.stringify([...response.headers.entries()], null, 2))
      
      const text = await response.text()
      console.log('📄 Fetch Response:', text.substring(0, 200) + '...')
      
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError.message)
    }
    
    // Test 3: DNS resolution
    console.log('\n🔍 Test 3: DNS resolution...')
    const dns = require('dns')
    dns.lookup(url.hostname, (err, address, family) => {
      if (err) {
        console.error('❌ DNS lookup failed:', err.message)
      } else {
        console.log('✅ DNS resolved:', address, 'IPv' + family)
      }
    })
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testSupabaseConnection()