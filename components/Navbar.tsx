"use client";

import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 bg-white border-b border-gray-100 fixed top-0 z-20">
      {/* Left: Hamburger (mobile only) */}
      <div className="flex items-center">
        <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      {/* Center: Empty */}
      <div className="flex-1 flex justify-center"></div>
      {/* Right: GreenCoin & Avatar */}
      <div className="flex items-center gap-5">
        <div className="flex items-center bg-green-100 px-3 py-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0a8 8 0 100-16 8 8 0 000 16zm-2.5-4.5h5" />
          </svg>
          <span className="font-semibold text-green-700 text-sm">
            1500 Poin
          </span>
        </div>
        <div>
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border-2 border-green-100 object-cover"
          />
        </div>
      </div>
    </nav>
  );
}