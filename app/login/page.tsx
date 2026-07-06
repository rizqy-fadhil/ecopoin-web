"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const bgUrl = "/landingpage.webp";

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
                {/* <a
                  href="#"
                  className="text-xs font-bold text-[#16a249] hover:text-[#15803d] transition-colors"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Lupa Kata Sandi?
                </a> */}
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

          Error
          {error && (
            <div className="mt-4 text-red-700 text-center text-sm bg-red-50 rounded-xl py-2.5 px-4 border border-red-100">
              {error}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}