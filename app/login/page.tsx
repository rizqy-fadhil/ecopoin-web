"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Berhasil login, arahkan ke halaman utama
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Sisi Kiri - Banner */}
      <div
        className="hidden md:flex w-1/2 relative flex-col justify-center items-center p-16"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 78, 41, 0.85), rgba(16, 78, 41, 0.85)), url('/assets/bg-register.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo - top left */}
        <div className="absolute top-10 left-12 flex items-center gap-3 z-20">
          <img
            src="/assets/logo-ecopoin.png"
            alt="EcoPoin Logo"
            className="h-10 w-auto"
          />
          <span className="text-white text-2xl font-extrabold tracking-tight">
            EcoPoin
          </span>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center max-w-md px-4 z-20">
          {/* Decorative icon */}
          <div className="mb-6 w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-green-300" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Selamat Datang<br />
            Kembali di{" "}
            <span className="text-green-300">EcoPoin</span>
          </h2>

          <p className="text-white/80 text-base leading-relaxed mb-8">
            Lanjutkan kontribusimu untuk Surabaya yang lebih hijau. Pantau tabungan sampahmu dan tukarkan poin dengan mudah.
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

      {/* Sisi Kanan - Area Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-8 py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 justify-center mb-8">
            <img
              src="/assets/logo-ecopoin.png"
              alt="EcoPoin Logo"
              className="h-9 w-auto"
            />
          </div>

          {/* Header Form - centered */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Masuk ke Akun Anda</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Masukkan detail akun untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-green-900 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Masukkan email"
                className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-900"
              />
            </div>

            {/* Kata Sandi & Lupa */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-green-900"
                >
                  Kata Sandi
                </label>
                <a
                  href="#"
                  className="text-sm text-green-600 font-medium hover:underline"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Lupa Kata Sandi?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi"
                className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-900"
              />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 mt-2 flex justify-center items-center transition-colors shadow-md shadow-green-200"
            >
              {loading ? "Masuk..." : "Masuk Sekarang"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 text-red-600 text-center text-sm bg-red-50 rounded-xl py-2 px-3">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="text-gray-400 text-xs font-bold">
              ATAU MASUK DENGAN
            </span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center border border-gray-200 rounded-full py-2.5 text-gray-800 font-semibold hover:bg-gray-50 transition"
            >
              <img
                src="/assets/google-icon.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center border border-gray-200 rounded-full py-2.5 text-gray-800 font-semibold hover:bg-gray-50 transition"
            >
              <img
                src="/assets/facebook-icon.svg"
                alt="Facebook"
                className="h-5 w-5 mr-2"
              />
              Facebook
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600 text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="text-green-700 font-bold hover:underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}