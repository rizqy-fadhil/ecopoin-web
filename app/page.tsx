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

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADF9rNS5fnwii-GpWiepAv7MEtRhAODOBXQtRvNZ3VTLCBCpDGx21mcNDJUOu2-x4QFtpR3sblsljpFwz2PgJYVjrI9rOWkhfbWKMF4rzFKaFdDOvMjukp7-XLVMWhEagxMppRKaH8ffoz6jJPJQIpFtjKRlTZJ-h5mHxt385cX79PgymEAVJtoqIRKbnhzN5liEIG4P7ZR6wh5pSi3tp7a0NdLCaFw-PbTpedUQGSdrGmEHP0l4Ljibp0kODQqfo0yddRPxl_lZUi";

export default function Home() {
  return (
    <div className="bg-[#f8fbf9] min-h-screen flex flex-col font-[Inter,sans-serif] antialiased">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-[#d1e6d8]/50">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-[#dcfce7] rounded-xl flex items-center justify-center">
            <Image
              src="/frame.png"
              alt="EcoPoin Logo"
              width={22}
              height={22}
              priority
            />
          </div>
          <span className="font-bold text-[#0e1b13] text-lg md:text-xl tracking-tight">
            EcoPoin
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-[#0e1b13] font-semibold hover:text-[#16a249] transition text-sm"
          >
            Beranda
          </Link>
          <Link
            href="#layanan"
            className="text-[#50956a] font-medium hover:text-[#16a249] transition text-sm"
          >
            Layanan
          </Link>
          <Link
            href="#carakerja"
            className="text-[#50956a] font-medium hover:text-[#16a249] transition text-sm"
          >
            Cara Kerja
          </Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login">
            <button
              className="px-5 py-2.5 border border-[#d1e6d8] text-[#0e1b13] rounded-xl font-semibold bg-white hover:bg-gray-50 transition text-sm shadow-sm"
            >
              Masuk
            </button>
          </Link>
          <Link href="/register">
            <button
              className="px-5 py-2.5 bg-[#16a249] text-white rounded-xl font-semibold hover:bg-[#15803d] transition text-sm shadow-lg shadow-[#16a249]/20"
            >
              Daftar
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#15803d]/90 via-[#15803d]/70 to-[#15803d]/50 z-10" />
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-[#dcfce7] rounded-full" />
              Gerakan Daur Ulang Surabaya
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Ubah Sampahmu Jadi{" "}
              <span className="text-[#dcfce7]">GreenCoin</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
              Bergabunglah dengan EcoPoin untuk mengelola sampah, dapatkan poin hijau, dan wujudkan lingkungan yang lebih bersih sekaligus memperoleh reward nyata!
            </p>
            <div className="flex gap-4 mb-8 flex-wrap">
              <Link href="/register">
                <button className="px-8 py-3.5 bg-white text-[#15803d] font-bold rounded-xl text-base hover:bg-[#dcfce7] transition shadow-lg transform active:scale-[0.98]">
                  Mulai Sekarang
                </button>
              </Link>
              <Link href="#layanan">
                <button className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-xl text-base bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
                  Pelajari Lebih Lanjut
                </button>
              </Link>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
              <Users className="w-5 h-5" />
              Bergabung dengan <span className="font-bold text-white ml-1">12k+</span> warga Surabaya
            </div>
          </div>

          {/* Right — Stats Cards */}
          <div className="flex-1 flex flex-col gap-5 max-w-sm w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10">
                <p className="text-3xl font-bold text-white">150+</p>
                <p className="text-sm text-white/60 mt-1">Ton Terkumpul</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10">
                <p className="text-3xl font-bold text-white">12k+</p>
                <p className="text-sm text-white/60 mt-1">Warga Terdaftar</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10">
                <p className="text-3xl font-bold text-white">50M+</p>
                <p className="text-sm text-white/60 mt-1">GreenCoin</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10">
                <p className="text-3xl font-bold text-white">4.8/5</p>
                <p className="text-sm text-white/60 mt-1">Rating App</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur / Solusi Section */}
      <section
        id="layanan"
        className="py-20 px-6 md:px-12 bg-[#f8fbf9]"
      >
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="inline-block bg-[#dcfce7] text-[#16a249] text-xs font-bold rounded-full px-4 py-1.5 mb-4 tracking-wider uppercase">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0e1b13] mb-3">
            Solusi Pengelolaan Sampah Cerdas
          </h2>
          <p className="text-[#50956a] max-w-xl mx-auto">
            Tiga layanan utama yang memudahkan kontribusimu untuk lingkungan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* EcoPick */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#d1e6d8]/50 p-8 flex flex-col items-center text-center hover:shadow-md transition group">
            <div className="w-14 h-14 bg-[#dcfce7] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#16a249] transition">
              <Truck className="w-7 h-7 text-[#16a249] group-hover:text-white transition" />
            </div>
            <div className="font-bold text-lg text-[#0e1b13] mb-2">EcoPick</div>
            <div className="text-[#50956a] text-sm leading-relaxed">
              Layanan jemput sampah ke rumah Anda sesuai jadwal, praktis & ramah lingkungan.
            </div>
          </div>
          {/* EcoDrop */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#d1e6d8]/50 p-8 flex flex-col items-center text-center hover:shadow-md transition group">
            <div className="w-14 h-14 bg-[#dcfce7] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#16a249] transition">
              <MapPin className="w-7 h-7 text-[#16a249] group-hover:text-white transition" />
            </div>
            <div className="font-bold text-lg text-[#0e1b13] mb-2">EcoDrop</div>
            <div className="text-[#50956a] text-sm leading-relaxed">
              Setorkan sampah di titik drop-off terverifikasi dan raih poin setiap kali berkontribusi.
            </div>
          </div>
          {/* GreenCoin */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#d1e6d8]/50 p-8 flex flex-col items-center text-center hover:shadow-md transition group">
            <div className="w-14 h-14 bg-[#dcfce7] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#16a249] transition">
              <Wallet className="w-7 h-7 text-[#16a249] group-hover:text-white transition" />
            </div>
            <div className="font-bold text-lg text-[#0e1b13] mb-2">GreenCoin</div>
            <div className="text-[#50956a] text-sm leading-relaxed">
              Tukarkan sampah dengan GreenCoin, gunakan poin Anda untuk berbagai reward menarik!
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section
        id="carakerja"
        className="py-20 px-6 md:px-12 bg-white"
      >
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="inline-block bg-[#dcfce7] text-[#16a249] text-xs font-bold rounded-full px-4 py-1.5 mb-4 tracking-wider uppercase">
            Panduan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0e1b13] mb-3">
            Cara Kerja EcoPoin
          </h2>
          <p className="text-[#50956a] max-w-xl mx-auto">
            Empat langkah mudah untuk mulai berkontribusi.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: <User className="w-6 h-6" />, step: "01", title: "Daftar Akun", desc: "Buat akun EcoPoin dengan mudah secara gratis." },
            { icon: <Trash2 className="w-6 h-6" />, step: "02", title: "Pilah Sampah", desc: "Pilah sampah sesuai kategori: organik, plastik, kaca, dll." },
            { icon: <Truck className="w-6 h-6" />, step: "03", title: "Setor/Jemput", desc: "Setorkan ke EcoDrop atau request pickup EcoPick." },
            { icon: <Gift className="w-6 h-6" />, step: "04", title: "Dapat Reward", desc: "Kumpulkan GreenCoin & tukarkan dengan reward menarik." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center bg-[#f8fbf9] rounded-2xl border border-[#d1e6d8]/50 p-6 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center mb-4 text-[#16a249] group-hover:bg-[#16a249] group-hover:text-white transition">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-[#16a249] mb-1">LANGKAH {item.step}</span>
              <div className="font-bold text-[#0e1b13] mb-1.5">{item.title}</div>
              <p className="text-[#50956a] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-12 px-6 md:px-12">
        <div className="bg-[#15803d] rounded-2xl py-14 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-white gap-8 md:gap-0 max-w-6xl mx-auto shadow-xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

          <div className="flex-1 text-center relative z-10">
            <div className="text-4xl md:text-5xl font-black">150+</div>
            <div className="text-white/70 mt-1.5 text-sm font-medium">Ton Sampah Terkumpul</div>
          </div>
          <div className="hidden md:block w-px bg-white/20 h-16 mx-3" />
          <div className="flex-1 text-center relative z-10">
            <div className="text-4xl md:text-5xl font-black">50M+</div>
            <div className="text-white/70 mt-1.5 text-sm font-medium">GreenCoin Didistribusikan</div>
          </div>
          <div className="hidden md:block w-px bg-white/20 h-16 mx-3" />
          <div className="flex-1 text-center relative z-10">
            <div className="text-4xl md:text-5xl font-black">12k+</div>
            <div className="text-white/70 mt-1.5 text-sm font-medium">Total Transaksi</div>
          </div>
          <div className="hidden md:block w-px bg-white/20 h-16 mx-3" />
          <div className="flex-1 text-center relative z-10">
            <div className="text-4xl md:text-5xl font-black">85T</div>
            <div className="text-white/70 mt-1.5 text-sm font-medium">CO₂ Dikurangi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f8fbf9] px-6 md:px-0">
        <div className="bg-white rounded-2xl max-w-3xl mx-auto p-12 md:p-16 flex flex-col items-center text-center shadow-sm border border-[#d1e6d8]/50">
          <div className="w-16 h-16 bg-[#dcfce7] rounded-2xl flex items-center justify-center mb-6">
            <Gift className="w-8 h-8 text-[#16a249]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0e1b13] mb-3">
            Siap Berkontribusi untuk Surabaya yang Lebih Hijau?
          </h2>
          <p className="text-[#50956a] mb-8 max-w-md">
            Daftar sekarang dan jadi bagian dari perubahan dengan EcoPoin. Sampahmu, masa depanmu!
          </p>
          <Link href="/register" className="w-full sm:w-auto">
            <button className="px-10 py-4 bg-[#16a249] text-white rounded-xl font-bold text-base shadow-lg shadow-[#16a249]/20 hover:bg-[#15803d] transition transform active:scale-[0.98] w-full sm:w-auto">
              Buat Akun Sekarang
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#d1e6d8]/50 pt-14 pb-6 px-6 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 justify-between mb-10">
          {/* Left: Logo & desc & social */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 bg-[#dcfce7] rounded-xl flex items-center justify-center">
                <Image
                  src="/frame.png"
                  alt="EcoPoin Logo"
                  width={22}
                  height={22}
                />
              </div>
              <span className="font-bold text-[#0e1b13] text-lg tracking-tight">
                EcoPoin
              </span>
            </div>
            <div className="text-[#50956a] text-sm mb-4 max-w-xs leading-relaxed">
              Ekosistem insentif untuk daur ulang dan penghargaan warga Surabaya, menciptakan perubahan nyata untuk masa depan yang lebih baik.
            </div>
            <div className="flex gap-3 mt-1">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f8fbf9] text-[#50956a] hover:bg-[#dcfce7] hover:text-[#16a249] transition"
              >
                <Camera className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f8fbf9] text-[#50956a] hover:bg-[#dcfce7] hover:text-[#16a249] transition"
              >
                <Globe className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="Linkedin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f8fbf9] text-[#50956a] hover:bg-[#dcfce7] hover:text-[#16a249] transition"
              >
                <Briefcase className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
          {/* Center: Navigation */}
          <div className="flex-1 flex flex-col items-start md:items-center mt-6 md:mt-0">
            <div className="font-bold text-[#0e1b13] mb-3 text-sm uppercase tracking-wider">Layanan</div>
            <Link
              href="#layanan"
              className="text-[#50956a] hover:text-[#16a249] py-1 text-sm transition"
            >
              EcoPick
            </Link>
            <Link
              href="#layanan"
              className="text-[#50956a] hover:text-[#16a249] py-1 text-sm transition"
            >
              EcoDrop
            </Link>
            <Link
              href="#layanan"
              className="text-[#50956a] hover:text-[#16a249] py-1 text-sm transition"
            >
              GreenCoin
            </Link>
          </div>
          {/* Right: Kritik & Saran Form */}
          <div className="flex-1 mt-6 md:mt-0">
            <div className="font-bold text-[#0e1b13] mb-3 text-sm uppercase tracking-wider">Kritik & Saran</div>
            <form
              className="flex items-center bg-[#f8fbf9] rounded-xl overflow-hidden border border-[#d1e6d8] max-w-sm"
              onSubmit={e => e.preventDefault()}
              autoComplete="off"
            >
              <input
                type="text"
                name="saran"
                placeholder="Tulis pesan Anda..."
                className="bg-transparent flex-1 px-4 py-3 outline-none text-[#0e1b13] text-sm placeholder:text-[#50956a]/60"
              />
              <button
                type="submit"
                className="bg-[#16a249] hover:bg-[#15803d] transition text-white p-2.5 m-1 rounded-xl"
                aria-label="Kirim"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-[#d1e6d8]/50 pt-6 text-center text-[#50956a] text-xs">
          © 2026 EcoPoin Surabaya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}