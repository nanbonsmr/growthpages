-- Create storage bucket for page images
INSERT INTO storage.buckets (id, name, public)
VALUES ('page-images', 'page-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'page-images');

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view page images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'page-images');

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'page-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'page-images' AND auth.uid()::text = (storage.foldername(name))[1]);