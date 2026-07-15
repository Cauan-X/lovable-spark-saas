DROP POLICY IF EXISTS "avatars read" ON storage.objects;

CREATE POLICY "avatars read own"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);