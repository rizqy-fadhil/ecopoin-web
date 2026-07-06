"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";

const bgUrl = "/landingpage.webp";

export default function Register() {
  const router = useRouter();
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fullName.trim()) {
      setError("Nama lengkap wajib diisi.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      setLoading(false);
      return;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, "").replace(/^0+/, "");
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      setError("Nomor telepon tidak valid. Masukkan 8-15 digit angka tanpa awalan 0 atau +62.");
      setLoading(false);
      return;
    }
    const fullPhoneNumber = `+62${cleanPhone}`;

    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName,
        phoneNumber: fullPhoneNumber,
      }),
    });
    const registerResult = await registerRes.json();

    if (!registerRes.ok) {
      setError(registerResult.error || "Gagal mendaftar. Coba lagi.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        "Akun berhasil dibuat, tetapi gagal masuk otomatis. Silakan login manual.",
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 font-[Inter,sans-serif] antialiased overflow-x-hidden">
      {/* ===== Left Side — Hero ===== */}
      <section className="relative hidden lg:flex flex-col justify-center p-12 overflow-hidden bg-[#15803d]">
        {/* Background image + overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#15803d]/40 z-10" />
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url("${bgUrl}")` }}
          />
        </div>

        <div className="relative z-20 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white mb-8">
            <div className="size-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Image src="/frame.png" alt="EcoPoin" width={24} height={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">EcoPoin</h2>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Bergabung dengan{" "}
            <span className="text-[#dcfce7]">Revolusi Hijau</span> Surabaya
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-12">
            Mulai kelola sampahmu secara digital, kumpulkan GreenCoin, dan
            jadilah bagian dari perubahan untuk kota yang lebih bersih.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white">150+ Ton</p>
              <p className="text-sm text-white/60">Sampah Terkumpul</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white">12k+</p>
              <p className="text-sm text-white/60">Warga Terdaftar</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Right Side — Form ===== */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-[#f8fbf9]">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Image src="/frame.png" alt="EcoPoin" width={30} height={30} />
            <h2 className="text-2xl font-bold text-[#0e1b13]">EcoPoin</h2>
          </div>

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#0e1b13] mb-2">
              Daftar Akun Baru
            </h2>
            <p className="text-[#50956a]">
              Lengkapi data diri untuk mulai menabung sampah.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#0e1b13] mb-1.5 ml-1"
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl border border-[#d1e6d8] bg-white px-4 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0e1b13] mb-1.5 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contoh@email.com"
                className="w-full rounded-xl border border-[#d1e6d8] bg-white px-4 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-[#0e1b13] mb-1.5 ml-1"
              >
                Nomor Telepon
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#50956a]">
                  +62
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  required
                  placeholder="8123456789"
                  className="w-full rounded-xl border border-[#d1e6d8] bg-white pl-14 pr-4 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#0e1b13] mb-1.5 ml-1"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 karakter"
                  className="w-full rounded-xl border border-[#d1e6d8] bg-white pl-4 pr-11 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#50956a] hover:text-[#16a249] transition-colors"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-xl bg-[#16a249] text-white font-bold text-base shadow-lg shadow-[#16a249]/20 hover:bg-[#15803d] transition-all transform active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </button>
            </div>

            {/* Error & Success */}
            {error && (
              <div className="text-red-700 text-center text-sm bg-red-50 rounded-xl py-2.5 px-4 border border-red-100">
                {error}
              </div>
            )}
          
          {/* Footer */}
          <p className="mt-10 text-center text-sm text-[#50956a]">
            Sudah punya akun?
            <Link
              href="/login"
              className="font-bold text-[#16a249] hover:text-[#15803d] ml-1 underline-offset-4 hover:underline transition-all"
            >
              Masuk
            </Link>
          </p>
          </form>
        </div>
      </section>
    </main>
  );
}