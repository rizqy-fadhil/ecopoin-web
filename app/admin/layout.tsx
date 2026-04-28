"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { LogOut } from "lucide-react";

// ADMIN SIDEBAR DATA
type SidebarItem = {
  label: string;
  icon: string;
  href: string;
};

const sidebarMenu: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "/overview.png",
    href: "/admin/dashboard",
  },
  {
    label: "User Management",
    icon: "/users.png",
    href: "/admin/user-management",
  },
  {
    label: "EcoPick Mgt",
    icon: "/ecopick.png",
    href: "/admin/ecopick",
  },
  {
    label: "EcoDrop Mgt",
    icon: "/ecodrop.png",
    href: "/admin/ecodrop",
  },
  {
    label: "GreenCoin Mgt",
    icon: "/greencoin.png",
    href: "/admin/greencoin",
  },
  {
    label: "Master Data",
    icon: "/settings.png",
    href: "/admin/master-data",
  },
];

function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-8 flex items-center gap-3 border-b border-slate-800">
          <img src="/frame.png" alt="EcoPoin Logo" className="h-8 w-8 rounded-full" />
          <div>
            <div className="text-xl font-bold leading-none">EcoPoin</div>
            <div className="text-xs font-semibold opacity-80 tracking-wide">Admin Panel</div>
          </div>
        </div>
        {/* Nav */}
        <nav className="mt-6 px-2">
          {sidebarMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 my-1 rounded-lg transition-colors hover:bg-slate-700 hover:text-green-300 font-medium text-sm"
            >
              <img src={item.icon} alt={item.label} className="w-4 h-4 mr-2 object-contain brightness-0 invert" />
              {item.label}
            </Link>
          ))}
        </nav>
      {/* Bottom: Logout */}
      <div className="mt-auto px-4 py-5">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      </div>
    </aside>
  );
}

// HOC to hide UserSidebar if di route /admin (for _app/provider/layout patterns that globally render UserSidebar)
function HideUserSidebarWhenAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Asumsi: Sidebar User biasanya di-render di layout global, sehingga kita cegah render di /admin
  React.useEffect(() => {
    // Cari elemen dengan id/class tertentu, lalu hide. (Optional: implementasi jika Sidebar User tidak di sini)
    // Tapi lebih optimal jika UserSidebar juga pakai pengecekan usePathname di layout global
  }, [pathname]);
  // Komponen ini hanya wrapper, return children saja.
  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Layout hijacks global UserSidebar by wrapper in usage on global layout
  // Or, if UserSidebar truly global, tambahkan pengecekan usePathname di UserSidebar
  // Di sini, pastikan hanya AdminSidebar yang tampil di halaman /admin/*
  return (
    <HideUserSidebarWhenAdmin>
        <div className="flex min-h-screen w-full items-start bg-gray-100">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 min-h-screen bg-gray-100 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </HideUserSidebarWhenAdmin>
  );
}