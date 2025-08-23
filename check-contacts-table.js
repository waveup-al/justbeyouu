require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking contacts table directly...');
console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Service Key:', supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'NOT SET');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkContactsTable() {
  try {
    console.log('\n🔗 Testing direct query to contacts table...');
    
    // Try to select from contacts table
    const { data, error, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.log('❌ Query error:', error.message);
      console.log('📝 Error details:', error);
      
      // If table doesn't exist, try to create it
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        console.log('\n🔨 Table does not exist, trying to create...');
        
        const { error: createError } = await supabase.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS contacts (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              subject VARCHAR(500),
              message TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
          `
        });
        
        if (createError) {
          console.log('❌ Failed to create table:', createError.message);
        } else {
          console.log('✅ Table created successfully!');
        }
      }
    } else {
      console.log('✅ Query successful!');
      console.log('📊 Total records:', count);
      console.log('📋 Sample data:', data);
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

checkContactsTable();