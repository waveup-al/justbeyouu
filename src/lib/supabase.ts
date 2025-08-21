import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Create public client for client-side operations (if needed)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for the contacts table
export interface Contact {
  id?: number
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
  updated_at?: string
}

// Database operations
export const supabaseOperations = {
  // Insert a new contact form submission into contacts table
  async insertContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase insert error:', error)
      throw new Error(`Failed to save contact: ${error.message}`)
    }
    
    return data
  },

  // Get all contacts from contacts table
  async getAllContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase select error:', error)
      throw new Error(`Failed to fetch contacts: ${error.message}`)
    }
    
    return data
  },

  // Get contact by ID
  async getContactById(id: number) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase select error:', error)
      throw new Error(`Failed to fetch contact: ${error.message}`)
    }
    
    return data
  }
}