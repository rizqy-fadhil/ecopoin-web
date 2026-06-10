-- Simpan email di profiles agar admin/user-management bisa menampilkannya
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;
