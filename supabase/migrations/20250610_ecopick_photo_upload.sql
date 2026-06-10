-- Kolom foto opsional pada transaksi
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS photo_url text;

-- Bucket storage untuk foto sampah
INSERT INTO storage.buckets (id, name, public)
VALUES ('waste-photos', 'waste-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Izinkan user terautentikasi upload ke folder miliknya
CREATE POLICY "Users can upload own waste photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'waste-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Izinkan semua membaca foto (bucket public)
CREATE POLICY "Public can read waste photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'waste-photos');
