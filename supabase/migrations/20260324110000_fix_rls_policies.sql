-- migrations/20260324110000_fix_rls_policies.sql
-- Fix RLS policies for listings table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "listings_select_public" ON listings;
DROP POLICY IF EXISTS "listings_insert_own" ON listings;
DROP POLICY IF EXISTS "listings_update_own" ON listings;
DROP POLICY IF EXISTS "listings_delete_own" ON listings;

-- Enable RLS (should already be enabled, but just in case)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can insert own listings" ON listings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings" ON listings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read active listings" ON listings
FOR SELECT USING (status = 'active' OR auth.uid() = user_id);