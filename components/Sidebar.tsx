"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "/overview.png" },
  { href: "/ecopick", label: "EcoPick", icon: "/ecopick.png" },
  { href: "/ecodrop", label: "EcoDrop", icon: "/ecodrop.png" },
  { href: "/greencoin", label: "GreenCoin", icon: "/greencoin.png" },
  { href: "/settings", label: "Settings", icon: "/settings.png" },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 h-screen bg-white shadow-lg px-4 py-6">
      <nav className="space-y-2">
        <div className="mb-8 flex items-center gap-2 px-2">
          <Image src="/frame.png" alt="EcoPoin Logo" width={24} height={24} />
          <span className="text-2xl font-bold text-green-700">EcoPoin</span>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-green-800 hover:bg-green-100 font-medium transition"
          >
            <img
              src={link.icon}
              alt={link.label}
              className="w-4 h-4 object-contain"
            />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}