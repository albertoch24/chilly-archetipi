-- Create storage bucket for quiz images
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-images', 'quiz-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to quiz images
CREATE POLICY "Public read access for quiz images"
ON storage.objects FOR SELECT
USING (bucket_id = 'quiz-images');

-- Allow authenticated users to upload quiz images (for admin)
CREATE POLICY "Admin upload access for quiz images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quiz-images');

-- Allow authenticated users to delete quiz images (for admin)
CREATE POLICY "Admin delete access for quiz images"
ON storage.objects FOR DELETE
USING (bucket_id = 'quiz-images');