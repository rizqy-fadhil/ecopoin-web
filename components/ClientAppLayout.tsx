"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export function ClientAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Jangan render Sidebar User jika prefix /admin, /login, /register, atau root ('/')
  const isHideSidebar =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";

  if (isHideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
