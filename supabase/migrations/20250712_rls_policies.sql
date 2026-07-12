-- ============================================================
-- RLS Policies untuk tabel profiles dan transactions
-- Fase 1 — Keamanan Kritis: Item #5
-- ============================================================

-- ==================== PROFILES ====================

-- Aktifkan RLS pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat profil sendiri
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- User hanya bisa mengupdate profil sendiri (kecuali role dan total_points)
-- total_points hanya boleh diubah oleh service role melalui API route
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin bisa melihat semua profil (untuk halaman admin)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- ==================== TRANSACTIONS ====================

-- Aktifkan RLS pada tabel transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat transaksi milik sendiri
CREATE POLICY "Users can view own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- User hanya bisa membuat transaksi untuk diri sendiri
CREATE POLICY "Users can insert own transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin bisa melihat semua transaksi
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- Admin bisa mengupdate semua transaksi (approve/reject)
CREATE POLICY "Admins can update all transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- ==================== RPC FUNCTIONS ====================

-- Fungsi atomic untuk menambah poin (digunakan saat approve ecopick/ecodrop)
CREATE OR REPLACE FUNCTION increment_profile_points(uid UUID, points INT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.profiles
  SET total_points = total_points + points
  WHERE id = uid;
$$;

-- Fungsi atomic untuk mengurangi poin (digunakan saat withdraw)
-- Mengembalikan error jika saldo tidak mencukupi
CREATE OR REPLACE FUNCTION decrement_points(uid UUID, amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INT;
BEGIN
  UPDATE public.profiles
  SET total_points = total_points - amount
  WHERE id = uid AND total_points >= amount
  RETURNING total_points INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Saldo tidak mencukupi atau user tidak ditemukan';
  END IF;

  RETURN new_balance;
END;
$$;
