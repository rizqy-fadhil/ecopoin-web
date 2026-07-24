"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export function ClientAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
