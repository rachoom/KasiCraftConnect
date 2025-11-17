-- First, remove all existing policies on storage.objects for profile-pictures bucket
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates tskn4k9_0" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads tskn4k9_0" ON storage.objects;

-- Create new policies with correct expressions
-- Allow anyone to upload files to profile-pictures bucket
CREATE POLICY "Allow public uploads to profile-pictures"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow anyone to update files in profile-pictures bucket
CREATE POLICY "Allow public updates to profile-pictures"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow anyone to delete files in profile-pictures bucket
CREATE POLICY "Allow public deletes from profile-pictures"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'profile-pictures');

-- Also allow SELECT (read) access
CREATE POLICY "Allow public reads from profile-pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
