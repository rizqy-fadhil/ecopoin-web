"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white px-4 py-3 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Image
            src="/frame.png"
            alt="EcoPoin Logo"
            width={38}
            height={38}
            className="rounded-full"
            priority
          />
          <span className="ml-2 font-bold text-green-700 text-lg md:text-xl">
            EcoPoin
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-green-700 font-semibold hover:text-green-900 transition">
            Beranda
          </Link>
          <Link href="#layanan" className="text-green-700 font-semibold hover:text-green-900 transition">
            Layanan
          </Link>
          <Link href="#carakerja" className="text-green-700 font-semibold hover:text-green-900 transition">
            Cara Kerja
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex gap-2">
          <Link
            href="/login"
            className="px-5 py-2 border-2 border-green-600 text-green-600 rounded-full font-semibold bg-white hover:bg-green-50 hover:border-green-700 hover:text-green-700 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
          >
            Daftar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-700 p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 shadow-lg absolute top-[62px] left-0 w-full z-20 flex flex-col gap-4 border-t">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-green-700 font-semibold text-lg">
            Beranda
          </Link>
          <Link href="#layanan" onClick={() => setIsMobileMenuOpen(false)} className="text-green-700 font-semibold text-lg">
            Layanan
          </Link>
          <Link href="#carakerja" onClick={() => setIsMobileMenuOpen(false)} className="text-green-700 font-semibold text-lg">
            Cara Kerja
          </Link>
          <hr />
          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-full font-semibold bg-white"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-full font-semibold"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
