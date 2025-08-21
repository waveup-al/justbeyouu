const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createContactsTable() {
  try {
    console.log('Creating contacts table...');
    
    // Create the contacts table
    const { data, error } = await supabase.rpc('create_contacts_table', {});
    
    if (error) {
      console.error('Error creating table:', error);
      
      // Try alternative method using raw SQL
      console.log('Trying alternative method...');
      const { data: sqlData, error: sqlError } = await supabase
        .from('contacts')
        .select('*')
        .limit(1);
      
      if (sqlError && sqlError.code === '42P01') {
        console.log('Table does not exist. This is expected for first run.');
        console.log('Please create the table manually in Supabase dashboard using the SQL script.');
      } else if (sqlError) {
        console.error('SQL Error:', sqlError);
      } else {
        console.log('Table already exists and is accessible!');
      }
    } else {
      console.log('Table created successfully:', data);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('Connection test result:', error.message);
    } else {
      console.log('Connection successful!');
    }
  } catch (err) {
    console.error('Connection test failed:', err.message);
  }
}

async function main() {
  await testConnection();
  await createContactsTable();
}

main();