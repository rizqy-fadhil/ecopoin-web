"use client";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Truck,
  MapPin,
  Wallet,
  Gift,
  Trash2,
  ArrowRight,
  Users,
  Camera,
  Globe,
  Briefcase,
} from "lucide-react";
import React from "react";

// Dummy images - replace with actual assets as needed
const heroImage =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80";

export default function Home() {
  return (
    <div className="bg-[#f5faf6] min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white px-4 py-3 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Logo - replace src with local asset */}
          <Image
            src="/logo-ecopoin.png"
            alt="EcoPoin Logo"
            width={38}
            height={38}
            className="rounded-full"
            priority
          />
          <span className="ml-2 font-bold text-green-700 text-lg md:text-xl">
            EcoPoin <span className="font-normal text-gray-500">Recycle & Reward</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-green-700 font-semibold hover:text-green-900 transition"
          >
            Beranda
          </Link>
          <Link
            href="#layanan"
            className="text-green-700 font-semibold hover:text-green-900 transition"
          >
            Layanan
          </Link>
          <Link
            href="#carakerja"
            className="text-green-700 font-semibold hover:text-green-900 transition"
          >
            Cara Kerja
          </Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/login">
            <button
              className="px-5 py-2 border-2 border-green-600 text-green-600 rounded-full font-semibold bg-white hover:bg-green-50 hover:border-green-700 hover:text-green-700 transition"
            >
              Masuk
            </button>
          </Link>
          <Link href="/register">
            <button
              className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
            >
              Daftar
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 px-4 md:px-12 py-20 bg-[#f5faf6]">
        {/* Left */}
        <div className="flex-1 max-w-xl">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold rounded-full px-4 py-1 mb-4">
            Gerakan Daur Ulang Surabaya
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4 leading-tight">
            Ubah Sampahmu Jadi{" "}
            <span className="text-green-500">GreenCoin</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-8">
            Bergabunglah dengan EcoPoin untuk mengelola sampah, dapatkan poin hijau, dan wujudkan lingkungan yang lebih bersih sekaligus memperoleh reward nyata untuk kehidupan yang lebih baik!
          </p>
          <div className="flex gap-4 mb-6 flex-wrap">
            <Link href="/register">
              <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-full text-lg hover:bg-green-700 transition shadow-sm">
                Mulai Sekarang
              </button>
            </Link>
            <Link href="#layanan">
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full text-lg bg-white hover:bg-gray-50 transition">
                Pelajari Lebih Lanjut
              </button>
            </Link>
          </div>
          <div className="flex items-center mt-3 gap-3 text-green-700 text-base font-medium">
            <Users className="w-5 h-5" />
            Bergabung dengan <span className="font-bold ml-1">12k+</span> warga Surabaya
          </div>
        </div>
        {/* Right */}
        <div className="flex-1 flex items-center justify-center relative w-full aspect-video max-w-md md:max-w-lg">
          <div className="overflow-hidden rounded-2xl shadow-xl aspect-video bg-green-50 w-full flex items-center justify-center">
            <Image
              src={heroImage}
              alt="EcoPoin Hero"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Fitur / Solusi Section */}
      <section
        id="layanan"
        className="py-16 px-4 md:px-12 bg-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 text-center mb-12">
          Solusi Pengelolaan Sampah Cerdas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* EcoPick */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
            <Truck className="w-12 h-12 text-green-600 mb-4" />
            <div className="font-bold text-xl text-green-800 mb-2">EcoPick</div>
            <div className="text-gray-600 text-base">
              Layanan jemput sampah ke rumah Anda sesuai jadwal, praktis & ramah lingkungan.
            </div>
          </div>
          {/* EcoDrop */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
            <MapPin className="w-12 h-12 text-green-600 mb-4" />
            <div className="font-bold text-xl text-green-800 mb-2">EcoDrop</div>
            <div className="text-gray-600 text-base">
              Setorkan sampah di titik drop-off terverifikasi dan raih poin setiap kali berkontribusi.
            </div>
          </div>
          {/* GreenCoin */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
            <Wallet className="w-12 h-12 text-green-600 mb-4" />
            <div className="font-bold text-xl text-green-800 mb-2">GreenCoin</div>
            <div className="text-gray-600 text-base">
              Tukarkan sampah dengan GreenCoin, gunakan poin Anda untuk berbagai reward menarik!
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section
        id="carakerja"
        className="py-16 px-4 md:px-12 bg-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 text-center mb-12">
          Cara Kerja EcoPoin
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Langkah 1 */}
          <div className="flex flex-col items-center text-center bg-green-50 rounded-xl shadow p-6">
            <User className="w-8 h-8 mb-3 text-green-700" />
            <div className="font-bold text-green-900 mb-1">1. Daftar Akun</div>
            <p className="text-gray-600 text-sm">
              Buat akun EcoPoin dengan mudah secara gratis.
            </p>
          </div>
          {/* Langkah 2 */}
          <div className="flex flex-col items-center text-center bg-green-50 rounded-xl shadow p-6">
            <Trash2 className="w-8 h-8 mb-3 text-green-700" />
            <div className="font-bold text-green-900 mb-1">2. Pilah Sampah</div>
            <p className="text-gray-600 text-sm">
              Pilah sampah sesuai kategori: organik, plastik, kaca, dll.
            </p>
          </div>
          {/* Langkah 3 */}
          <div className="flex flex-col items-center text-center bg-green-50 rounded-xl shadow p-6">
            <Truck className="w-8 h-8 mb-3 text-green-700" />
            <div className="font-bold text-green-900 mb-1">3. Setor/Jemput</div>
            <p className="text-gray-600 text-sm">
              Setorkan ke EcoDrop atau request pickup EcoPick.
            </p>
          </div>
          {/* Langkah 4 */}
          <div className="flex flex-col items-center text-center bg-green-50 rounded-xl shadow p-6">
            <Gift className="w-8 h-8 mb-3 text-green-700" />
            <div className="font-bold text-green-900 mb-1">4. Dapat Reward</div>
            <p className="text-gray-600 text-sm">
              Kumpulkan GreenCoin & tukarkan dengan reward menarik.
            </p>
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-10 px-4 md:px-12">
        <div className="bg-green-600 rounded-2xl py-12 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between text-white gap-6 md:gap-0 max-w-6xl mx-auto shadow">
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-4xl font-extrabold">150+</div>
            <div className="text-white/80 mt-1 text-base md:text-lg">Ton Sampah Terkumpul</div>
          </div>
          <div className="hidden md:block w-px bg-white/30 h-14 mx-3" />
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-4xl font-extrabold">50M+</div>
            <div className="text-white/80 mt-1 text-base md:text-lg">GreenCoin Didistribusikan</div>
          </div>
          <div className="hidden md:block w-px bg-white/30 h-14 mx-3" />
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-4xl font-extrabold">12k+</div>
            <div className="text-white/80 mt-1 text-base md:text-lg">Total Transaksi</div>
          </div>
          <div className="hidden md:block w-px bg-white/30 h-14 mx-3" />
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-4xl font-extrabold">85T</div>
            <div className="text-white/80 mt-1 text-base md:text-lg">CO₂ Dikurangi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white px-4 md:px-0">
        <div className="bg-green-50 rounded-2xl max-w-3xl mx-auto p-12 flex flex-col items-center text-center shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">
            Siap Berkontribusi untuk Surabaya yang Lebih Hijau?
          </h2>
          <p className="text-gray-700 mb-8">
            Daftar sekarang dan jadi bagian dari perubahan dengan EcoPoin. Sampahmu, masa depanmu!
          </p>
          <Link href="/register" className="w-full sm:w-auto">
            <button className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition w-full sm:w-auto">
              Buat Akun Sekarang
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t pt-12 pb-4 px-4 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 justify-between mb-8">
          {/* Left: Logo & desc & social */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/logo-ecopoin.png"
                alt="EcoPoin Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="ml-2 font-bold text-green-700 text-lg">
                EcoPoin
              </span>
            </div>
            <div className="text-gray-500 mb-3 max-w-xs">
              Ekosistem insentif untuk daur ulang dan penghargaan warga Surabaya, menciptakan perubahan nyata untuk masa depan yang lebih baik.
            </div>
            <div className="flex gap-3 mt-3">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 text-gray-400"
              >
                <Camera className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 text-gray-400"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="Linkedin"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 text-gray-400"
              >
                <Briefcase className="w-6 h-6" />
              </a>
            </div>
          </div>
          {/* Center: Navigation */}
          <div className="flex-1 flex flex-col items-start md:items-center mt-6 md:mt-0">
            <div className="font-bold text-green-900 mb-3">Layanan</div>
            <Link
              href="#layanan"
              className="text-gray-600 hover:text-green-700 py-1"
            >
              EcoPick
            </Link>
            <Link
              href="#layanan"
              className="text-gray-600 hover:text-green-700 py-1"
            >
              EcoDrop
            </Link>
            <Link
              href="#layanan"
              className="text-gray-600 hover:text-green-700 py-1"
            >
              GreenCoin
            </Link>
          </div>
          {/* Right: Kritik & Saran Form */}
          <div className="flex-1 mt-6 md:mt-0">
            <div className="font-bold text-green-900 mb-3">Kritik & Saran</div>
            <form
              className="flex items-center bg-green-50 rounded-full overflow-hidden shadow border border-green-100 max-w-sm"
              onSubmit={e => e.preventDefault()}
              autoComplete="off"
            >
              <input
                type="text"
                name="saran"
                placeholder="Pesan"
                className="bg-transparent flex-1 px-4 py-2 outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition text-white p-2 rounded-full"
                aria-label="Kirim"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-gray-400 text-sm">
          © 2026 EcoPoin Surabaya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}