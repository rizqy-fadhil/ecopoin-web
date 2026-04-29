"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Anda bisa mengganti dengan env var di project real
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const bgUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADF9rNS5fnwii-GpWiepAv7MEtRhAODOBXQtRvNZ3VTLCBCpDGx21mcNDJUOu2-x4QFtpR3sblsljpFwz2PgJYVjrI9rOWkhfbWKMF4rzFKaFdDOvMjukp7-XLVMWhEagxMppRKaH8ffoz6jJPJQIpFtjKRlTZJ-h5mHxt385cX79PgymEAVJtoqIRKbnhzN5liEIG4P7ZR6wh5pSi3tp7a0NdLCaFw-PbTpedUQGSdrGmEHP0l4Ljibp0kODQqfo0yddRPxl_lZUi";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError || !data.user) {
      setError(signupError?.message || "Gagal mendaftar. Coba lagi.");
      setLoading(false);
      return;
    }

    // Insert/update ke tabel profiles
    const userId = data.user.id;
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([
        {
          id: userId,
          full_name: fullName,
          phone_number: fullPhoneNumber,
          email: email,
        },
      ], { onConflict: "id" });

    if (profileError) {
      console.error("Profile Error:", profileError);
      setError(`Akun dibuat, tetapi gagal menyimpan profil: ${profileError.message}`);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
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
              <input
                id="password"
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 8 karakter"
                className="w-full rounded-xl border border-[#d1e6d8] bg-white px-4 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
              />
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
            {success && (
              <div className="text-emerald-700 text-center text-sm bg-emerald-50 rounded-xl py-2.5 px-4 border border-emerald-100">
                Berhasil mendaftar! Silakan cek email untuk verifikasi.
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#d1e6d8]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8fbf9] px-4 text-[#50956a] font-medium tracking-wider">
                Atau daftar dengan
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d1e6d8] bg-white px-4 text-sm font-bold text-[#0e1b13] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg aria-hidden="true" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.603 32.659 29.129 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
                <path fill="#FF3D00" d="M6.306 14.691 12.88 19.51C14.657 15.108 18.967 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z" />
                <path fill="#4CAF50" d="M24 44c5.018 0 9.713-1.922 13.207-5.051l-6.097-5.162C29.066 35.091 26.645 36 24 36c-5.108 0-9.568-3.317-11.261-7.946l-6.522 5.025C9.52 39.556 16.227 44 24 44Z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.193 5.787l.003-.002 6.097 5.162C36.777 39.318 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d1e6d8] bg-white px-4 text-sm font-bold text-[#0e1b13] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
              </svg>
              Facebook
            </button>
          </div>

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
        </div>
      </section>
    </main>
  );
}