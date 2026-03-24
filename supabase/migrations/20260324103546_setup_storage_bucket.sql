-- 20260324103546_setup_storage_bucket.sql
-- Set up storage bucket for listing photos

-- Create the listings bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the listings bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'listings');

CREATE POLICY "Users can upload their own listing photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own listing photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own listing photos" ON storage.objects
FOR DELETE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
