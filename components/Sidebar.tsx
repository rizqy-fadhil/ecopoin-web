"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "/overview.png" },
  { href: "/ecopick", label: "EcoPick", icon: "/ecopick.png" },
  { href: "/ecodrop", label: "EcoDrop", icon: "/ecodrop.png" },
  { href: "/greencoin", label: "GreenCoin", icon: "/greencoin.png" },
  { href: "/settings", label: "Settings", icon: "/settings.png" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg px-4 py-3
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="space-y-2">
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Image src="/frame.png" alt="EcoPoin Logo" width={22} height={22} />
              <span className="text-xl font-bold text-green-700">EcoPoin</span>
            </div>
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${
                  isActive ? "bg-green-100 text-green-800" : "text-green-800 hover:bg-green-100"
                }`}
              >
              <img
                src={link.icon}
                alt={link.label}
                className="w-4 h-4 object-contain"
              />
              {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}