const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrateContactsData() {
  console.log('🔄 Starting contacts data migration...');
  
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Read local contacts.json file
  const contactsFilePath = path.join(__dirname, 'contacts.json');
  
  if (!fs.existsSync(contactsFilePath)) {
    console.log('ℹ️ No contacts.json file found. Nothing to migrate.');
    return;
  }
  
  try {
    const contactsData = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    console.log(`📋 Found ${contactsData.length} contacts in local file`);
    
    if (contactsData.length === 0) {
      console.log('ℹ️ No contacts to migrate.');
      return;
    }
    
    // Check existing contacts in Supabase
    console.log('🔍 Checking existing contacts in Supabase...');
    const { data: existingContacts, error: fetchError } = await supabase
      .from('contacts')
      .select('id, email, created_at');
    
    if (fetchError) {
      console.error('❌ Error fetching existing contacts:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${existingContacts?.length || 0} existing contacts in Supabase`);
    
    // Filter out contacts that already exist (by email and approximate time)
    const existingEmails = new Set(existingContacts?.map(c => c.email) || []);
    const newContacts = contactsData.filter(contact => {
      return !existingEmails.has(contact.email);
    });
    
    console.log(`🆕 ${newContacts.length} new contacts to migrate`);
    
    if (newContacts.length === 0) {
      console.log('✅ All contacts already exist in Supabase. No migration needed.');
      return;
    }
    
    // Prepare contacts for insertion (only use available columns)
    const contactsToInsert = newContacts.map(contact => ({
      name: contact.name,
      email: contact.email,
      subject: contact.subject || null,
      message: contact.message,
      created_at: contact.createdAt || contact.created_at || new Date().toISOString()
      // Note: ip_address and user_agent columns don't exist in current table
    }));
    
    console.log('📤 Inserting contacts into Supabase...');
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < contactsToInsert.length; i += batchSize) {
      const batch = contactsToInsert.slice(i, i + batchSize);
      
      const { data: insertedData, error: insertError } = await supabase
        .from('contacts')
        .insert(batch)
        .select('id');
      
      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully (${insertedData?.length || batch.length} records)`);
        successCount += insertedData?.length || batch.length;
      }
      
      // Small delay between batches
      if (i + batchSize < contactsToInsert.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} contacts`);
    console.log(`❌ Failed to migrate: ${errorCount} contacts`);
    
    if (successCount > 0) {
      // Verify the migration
      console.log('\n🔍 Verifying migration...');
      const { data: finalCount, error: countError } = await supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true });
      
      if (countError) {
        console.log('⚠️ Could not verify final count:', countError.message);
      } else {
        console.log(`📊 Total contacts in Supabase: ${finalCount || 'unknown'}`);
      }
      
      // Create backup of migrated data
      const backupPath = path.join(__dirname, `contacts-backup-${Date.now()}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(contactsData, null, 2));
      console.log(`💾 Backup created: ${backupPath}`);
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 You can now test the contact form to ensure it works with Supabase.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the migration
migrateContactsData().catch(console.error);