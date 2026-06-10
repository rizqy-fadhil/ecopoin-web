-- Jalankan di Supabase SQL Editor jika delete masih gagal tanpa SUPABASE_SERVICE_ROLE_KEY

-- Izinkan trash_category_id NULL pada transaksi historis setelah kategori dihapus
ALTER TABLE public.transactions
  ALTER COLUMN trash_category_id DROP NOT NULL;

-- (Opsional) Otomatis set NULL saat kategori dihapus langsung dari database
ALTER TABLE public.transactions
  DROP CONSTRAINT IF EXISTS transactions_trash_category_id_fkey;

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_trash_category_id_fkey
  FOREIGN KEY (trash_category_id)
  REFERENCES public.trash_categories(id)
  ON DELETE SET NULL;

CREATE POLICY "Admins can delete trash_categories"
ON public.trash_categories
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);
