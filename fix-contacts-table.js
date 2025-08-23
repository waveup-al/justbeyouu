const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixContactsTable() {
  console.log('🔧 Fixing contacts table structure...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First, let's check the current table structure
    console.log('🔍 Checking current table structure...');
    
    const { data: existingData, error: selectError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Error checking table:', selectError.message);
    } else {
      console.log('✅ Current table exists with data:', existingData?.length || 0, 'records');
      if (existingData && existingData.length > 0) {
        console.log('📋 Current columns:', Object.keys(existingData[0]));
      }
    }
    
    // Try to add missing columns
    console.log('\n🔨 Adding missing columns...');
    
    // Test if we can insert with minimal data first
    const testInsert = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    };
    
    const { data: testData, error: testError } = await supabase
      .from('contacts')
      .insert(testInsert)
      .select();
    
    if (testError) {
      console.log('❌ Basic insert failed:', testError.message);
      
      // If basic insert fails, we need to check what columns exist
      console.log('\n🔍 Let me check what we can insert...');
      
      // Try with just the essential fields
      const minimalInsert = {
        name: 'Test',
        email: 'test2@example.com',
        message: 'Test'
      };
      
      const { data: minimalData, error: minimalError } = await supabase
        .from('contacts')
        .insert(minimalInsert)
        .select();
      
      if (minimalError) {
        console.log('❌ Even minimal insert failed:', minimalError.message);
        console.log('\n💡 The table might need to be recreated. Please run this SQL in Supabase dashboard:');
        console.log(`
-- Drop existing table if needed
DROP TABLE IF EXISTS contacts;

-- Create new table with correct structure
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Enable all operations for service role" ON contacts
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for anon users (for form submissions)
CREATE POLICY "Enable insert for anon users" ON contacts
  FOR INSERT WITH CHECK (true);
`);
      } else {
        console.log('✅ Minimal insert successful:', minimalData[0]?.id);
        console.log('📋 Available columns:', Object.keys(minimalData[0]));
      }
    } else {
      console.log('✅ Basic insert successful:', testData[0]?.id);
      console.log('📋 Available columns:', Object.keys(testData[0]));
      
      // Now try with additional fields
      console.log('\n🧪 Testing with additional fields...');
      
      const fullInsert = {
        name: 'Full Test User',
        email: 'fulltest@example.com',
        subject: 'Test Subject',
        message: 'Full test message',
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent'
      };
      
      const { data: fullData, error: fullError } = await supabase
        .from('contacts')
        .insert(fullInsert)
        .select();
      
      if (fullError) {
        console.log('❌ Full insert failed:', fullError.message);
        
        // Try without the problematic fields
        const partialInsert = {
          name: 'Partial Test User',
          email: 'partialtest@example.com',
          subject: 'Test Subject',
          message: 'Partial test message'
        };
        
        const { data: partialData, error: partialError } = await supabase
          .from('contacts')
          .insert(partialInsert)
          .select();
        
        if (partialError) {
          console.log('❌ Partial insert also failed:', partialError.message);
        } else {
          console.log('✅ Partial insert successful:', partialData[0]?.id);
          console.log('📋 Working columns:', Object.keys(partialData[0]));
        }
      } else {
        console.log('✅ Full insert successful:', fullData[0]?.id);
        console.log('📋 All columns working:', Object.keys(fullData[0]));
      }
    }
    
    // Clean up test records
    console.log('\n🧹 Cleaning up test records...');
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .like('email', 'test%@example.com');
    
    if (deleteError) {
      console.log('⚠️ Could not clean up test records:', deleteError.message);
    } else {
      console.log('✅ Test records cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
  }
}

// Run the fix
fixContactsTable().catch(console.error);
