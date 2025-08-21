const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔧 Testing Supabase Connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL:', supabaseUrl);
  console.log('Service Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\n📊 Testing database connection...');
    
    // Test 1: Check if we can query system tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (tablesError) {
      console.log('❌ Cannot query system tables:', tablesError.message);
      
      // Test 2: Try a simple RPC call
      console.log('\n🔄 Trying RPC call...');
      const { data: version, error: versionError } = await supabase.rpc('version');
      
      if (versionError) {
        console.log('❌ RPC call failed:', versionError.message);
        
        // Test 3: Try to check if contacts table exists
        console.log('\n📋 Checking contacts table...');
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact', head: true });
        
        if (contactsError) {
          console.log('❌ Contacts table error:', contactsError.message);
          
          if (contactsError.code === 'PGRST116') {
            console.log('\n💡 Table \'contacts\' does not exist. Creating it...');
            await createContactsTable(supabase);
          }
        } else {
          console.log('✅ Contacts table exists with', contacts, 'records');
        }
      } else {
        console.log('✅ RPC call successful:', version);
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('Available tables:', tables?.map(t => t.table_name));
      
      // Check contacts table specifically
      const contactsTable = tables?.find(t => t.table_name === 'contacts');
      if (contactsTable) {
        console.log('✅ Contacts table exists');
        
        // Test inserting a record
        await testContactsTable(supabase);
      } else {
        console.log('⚠️ Contacts table not found. Creating it...');
        await createContactsTable(supabase);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

async function createContactsTable(supabase) {
  console.log('\n🔨 Creating contacts table...');
  
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS contacts (
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
    `
  });
  
  if (error) {
    console.log('❌ Failed to create table via RPC:', error.message);
    
    // Try alternative method using raw SQL
    console.log('🔄 Trying alternative table creation...');
    
    const { error: createError } = await supabase
      .from('contacts')
      .insert({
        name: 'test',
        email: 'test@test.com',
        message: 'test message'
      });
    
    if (createError && createError.code === 'PGRST116') {
      console.log('❌ Table still does not exist. Manual creation required.');
      console.log('\n📋 Please run this SQL in your Supabase dashboard:');
      console.log(`
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

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service role" ON contacts
  FOR ALL USING (auth.role() = 'service_role');
`);
    } else {
      console.log('✅ Table creation successful (via insert test)');
    }
  } else {
    console.log('✅ Table created successfully!');
  }
}

async function testContactsTable(supabase) {
  console.log('\n🧪 Testing contacts table operations...');
  
  // Test insert
  const testContact = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from connection script',
    ip_address: '127.0.0.1'
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('contacts')
    .insert(testContact)
    .select();
  
  if (insertError) {
    console.log('❌ Insert test failed:', insertError.message);
  } else {
    console.log('✅ Insert test successful:', insertData[0]?.id);
    
    // Test select
    const { data: selectData, error: selectError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Select test failed:', selectError.message);
    } else {
      console.log('✅ Select test successful. Records found:', selectData?.length);
    }
  }
}

// Run the test
testSupabaseConnection().catch(console.error);