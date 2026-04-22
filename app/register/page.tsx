"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Anda bisa mengganti dengan env var di project real
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const bgUrl =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1000&q=80";

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
    if (!/^\+62\d{8,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
      setError("Nomor telepon harus format Indonesia dan valid (cth: +6281234567890).");
      setLoading(false);
      return;
    }

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
          phone_number: phoneNumber.replace(/\s/g, ""),
          email: email,
        },
      ], { onConflict: "id" });

    if (profileError) {
      setError("Akun dibuat, tetapi gagal menyimpan profil. Hubungi admin.");
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
    <div className="min-h-screen flex items-stretch">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 relative flex-col justify-center items-center p-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${bgUrl}')`,
            zIndex: 0,
          }}
        />
        <div className="absolute inset-0 bg-green-900/85 z-10" />

        {/* Logo - top left */}
        <div className="absolute top-10 left-12 z-20 flex items-center gap-3">
          <Image
            src="/logo-ecopoin.png"
            alt="EcoPoin Logo"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="text-white text-2xl font-extrabold tracking-tight">
            EcoPoin
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-md px-4">
          {/* Decorative icon */}
          <div className="mb-6 w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-green-300" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          </div>

          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Bergabung dengan<br />
            <span className="text-green-300">Revolusi Hijau</span><br />
            Surabaya
          </h1>

          <p className="text-white/80 text-base leading-relaxed mb-8">
            Mulai kelola sampahmu secara digital, kumpulkan GreenCoin, dan jadilah bagian dari perubahan untuk kota yang lebih bersih.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mt-2">
            {[
              { value: "10K+", label: "Pengguna Aktif" },
              { value: "50T", label: "Sampah Dikelola" },
              { value: "4.9★", label: "Rating App" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-green-300 text-xl font-bold">{stat.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-8 py-12 min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 justify-center mb-8">
            <Image
              src="/logo-ecopoin.png"
              alt="EcoPoin Logo"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
            <span className="text-green-700 text-xl font-extrabold tracking-tight">EcoPoin</span>
          </div>

          {/* Header - centered */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Daftar Akun Baru</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Lengkapi data diri untuk mulai menabung sampah.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  inputMode="tel"
                  pattern="^\+62\d{8,15}$"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  required
                  placeholder="Contoh: +6281234567890"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 karakter"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 mt-2 transition-colors flex items-center justify-center shadow-md shadow-green-200"
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>

            {/* Error & Success */}
            {error && (
              <div className="text-red-600 text-center text-sm mt-1 bg-red-50 rounded-xl py-2 px-3">{error}</div>
            )}
            {success && (
              <div className="text-green-700 text-center text-sm mt-1 bg-green-50 rounded-xl py-2 px-3">
                Berhasil mendaftar! Silakan cek email untuk verifikasi.
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-4 text-gray-400 text-xs font-bold">
                ATAU DAFTAR DENGAN
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                className="w-1/2 flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 text-black font-medium hover:bg-gray-50 transition"
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
                className="w-1/2 flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 text-black font-medium hover:bg-gray-50 transition"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-gray-600 text-sm text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-green-700 font-bold hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}