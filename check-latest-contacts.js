require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLatestContacts() {
  try {
    console.log('🔍 Checking latest contacts...');
    
    // Get latest 5 contacts ordered by created_at
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.log('❌ Query error:', error.message);
      return;
    }
    
    console.log('✅ Latest 5 contacts:');
    data.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} (${contact.email}) - ${contact.created_at}`);
      console.log(`   Subject: ${contact.subject}`);
      console.log(`   Message: ${contact.message.substring(0, 50)}...`);
      console.log('');
    });
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

checkLatestContacts();