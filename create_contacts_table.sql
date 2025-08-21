-- Create contacts table in Supabase
CREATE TABLE IF NOT EXISTS public.contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert for authenticated users
CREATE POLICY "Allow insert for service role" ON public.contacts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy to allow select for authenticated users
CREATE POLICY "Allow select for service role" ON public.contacts
    FOR SELECT
    TO service_role
    USING (true);

-- Grant permissions to service role
GRANT ALL ON public.contacts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE contacts_id_seq TO service_role;