"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/ecopick", label: "EcoPick", icon: "🗑️" },
  { href: "/ecodrop", label: "EcoDrop", icon: "🚚" },
  { href: "/greencoin", label: "GreenCoin", icon: "💰" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/login");
  };

  return (
    <aside className="flex flex-col w-64 h-screen bg-white shadow-lg px-4 py-6 justify-between">
      <nav className="space-y-2">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl font-bold text-green-700">🌱 EcoPoin</span>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-green-800 hover:bg-green-100 font-medium transition"
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-2 p-3 w-full text-red-600 font-semibold rounded-lg hover:bg-red-50 transition mt-8"
      >
        <span className="text-lg">🚪</span>
        Logout
      </button>
    </aside>
  );
}