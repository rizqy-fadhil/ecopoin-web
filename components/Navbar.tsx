"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="w-full h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 z-20">
      {/* Left: Hamburger (mobile only) */}
      <div className="flex items-center">
        <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      {/* Center: Empty */}
      <div className="flex-1 flex justify-center"></div>
    </nav>
  );
}