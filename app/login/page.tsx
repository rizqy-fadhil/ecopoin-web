"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const bgUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADF9rNS5fnwii-GpWiepAv7MEtRhAODOBXQtRvNZ3VTLCBCpDGx21mcNDJUOu2-x4QFtpR3sblsljpFwz2PgJYVjrI9rOWkhfbWKMF4rzFKaFdDOvMjukp7-XLVMWhEagxMppRKaH8ffoz6jJPJQIpFtjKRlTZJ-h5mHxt385cX79PgymEAVJtoqIRKbnhzN5liEIG4P7ZR6wh5pSi3tp7a0NdLCaFw-PbTpedUQGSdrGmEHP0l4Ljibp0kODQqfo0yddRPxl_lZUi";

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

    // 1. Lakukan login ke Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;
    if (!user) {
      setError("Login gagal. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    // 2. Jika berhasil, cek 'role' dia di tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("Data Profile:", profile);
    console.log("Error Profile:", profileError);

    if (profileError) {
      console.error("Gagal mengambil profil:", profileError);
    }
    
    // 3. Arahkan ke rute yang sesuai
    if (profile?.role === "admin") {
      router.push("/admin/dashboard"); // Lempar ke area Admin
    } else {
      router.push("/dashboard"); // Lempar ke area User biasa
    }

    setLoading(false);
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
            Selamat Datang{" "}
            <span className="text-[#dcfce7]">Kembali</span> di EcoPoin
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-12">
            Lanjutkan kontribusimu untuk Surabaya yang lebih hijau. Pantau
            tabungan sampahmu dan tukarkan poin dengan mudah.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white">4.8/5</p>
              <p className="text-sm text-white/60">Rating Pengguna</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-sm text-white/60">Layanan Jemput</p>
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
              Masuk ke Akun Anda
            </h2>
            <p className="text-[#50956a]">
              Masukkan detail akun untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-[#d1e6d8] bg-white px-4 py-3 text-sm text-[#0e1b13] placeholder-[#50956a]/60 focus:border-[#16a249] focus:ring-1 focus:ring-[#16a249] outline-none transition-all"
              />
            </div>

            {/* Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#0e1b13]"
                >
                  Kata Sandi
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#16a249] hover:text-[#15803d] transition-colors"
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
                {loading ? "Masuk..." : "Masuk Sekarang"}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 text-red-700 text-center text-sm bg-red-50 rounded-xl py-2.5 px-4 border border-red-100">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#d1e6d8]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8fbf9] px-4 text-[#50956a] font-medium tracking-wider">
                Atau masuk dengan
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
            Belum punya akun?
            <Link
              href="/register"
              className="font-bold text-[#16a249] hover:text-[#15803d] ml-1 underline-offset-4 hover:underline transition-all"
            >
              Daftar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}