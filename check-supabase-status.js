require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function checkSupabaseStatus() {
  try {
    console.log('🔍 Checking Supabase connection and contacts table...')
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    console.log('📡 Supabase URL:', supabaseUrl)
    console.log('🔑 Service Key:', supabaseServiceKey.substring(0, 20) + '...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test connection
    console.log('\n🔗 Testing connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      return
    }
    
    console.log('✅ Connection successful!')
    
    // Check if contacts table exists
    console.log('\n📋 Checking contacts table...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'contacts')
    
    if (tableError) {
      console.error('❌ Table check failed:', tableError.message)
      return
    }
    
    if (tableCheck && tableCheck.length > 0) {
      console.log('✅ Contacts table exists!')
      
      // Check table structure
      console.log('\n🏗️ Checking table structure...')
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'contacts')
        .eq('table_schema', 'public')
      
      if (columnsError) {
        console.error('❌ Column check failed:', columnsError.message)
      } else {
        console.log('📊 Table structure:')
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
        })
      }
      
      // Check existing data
      console.log('\n📊 Checking existing data...')
      const { data: contacts, error: dataError, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .limit(5)
      
      if (dataError) {
        console.error('❌ Data check failed:', dataError.message)
      } else {
        console.log(`📈 Found ${count} records in contacts table`)
        if (contacts && contacts.length > 0) {
          console.log('🔍 Sample records:')
          contacts.forEach((contact, index) => {
            console.log(`  ${index + 1}. ${contact.name} (${contact.email}) - ${contact.subject}`)
          })
        } else {
          console.log('📭 No records found in contacts table')
        }
      }
      
    } else {
      console.log('❌ Contacts table does not exist!')
      
      // Try to create the table
      console.log('\n🔨 Attempting to create contacts table...')
      const { data: createResult, error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(500) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Enable RLS
          ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Allow service role to insert" ON contacts
            FOR INSERT TO service_role WITH CHECK (true);
          
          CREATE POLICY "Allow service role to select" ON contacts
            FOR SELECT TO service_role USING (true);
        `
      })
      
      if (createError) {
        console.error('❌ Table creation failed:', createError.message)
      } else {
        console.log('✅ Contacts table created successfully!')
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

checkSupabaseStatus()
