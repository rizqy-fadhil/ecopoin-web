import React from "react";
import {
  Upload,
  FolderOpen,
  Calendar,
  MapPin,
  ChevronDown,
} from "lucide-react";

export default function PickupPage() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Schedule Pickup
        </h1>
        <p className="text-gray-700 max-w-xl">
          Ready to recycle? Fill in the details below to schedule a waste pickup from your location and earn EcoPoints.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:[grid-template-columns:2fr_1fr] gap-8">
        {/* Left Column */}
        <div>
          {/* Card 1: Upload Waste Photos */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Upload Waste Photos
            </h2>
            <label
              htmlFor="waste-upload"
              className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-green-300 rounded-xl py-8 px-4 transition hover:bg-green-50"
            >
              <Upload className="w-12 h-12 text-green-400 mb-2" />
              <span className="font-medium text-green-700 mb-1">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max. 3MB)
              </span>
              <input
                id="waste-upload"
                name="waste-upload"
                type="file"
                accept="image/*"
                className="hidden"
                multiple
              />
            </label>
          </div>
          {/* Card 2: Category, Weight, Notes */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-green-600" />
              Waste Category
            </h2>
            {/* Category Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select category
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-lg border border-gray-300 pr-10 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category (e.g. Plastic, Paper)
                  </option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="metal">Metal</option>
                  <option value="glass">Glass</option>
                  <option value="organic">Organic</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Estimated Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="0.0"
                  className="block w-full rounded-lg border border-gray-300 pr-12 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                  kg
                </span>
              </div>
            </div>
            {/* Notes for Driver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes for Driver
              </label>
              <textarea
                rows={3}
                placeholder="E.g., The waste is in front of the blue gate..."
                className="block w-full rounded-lg border border-gray-300 p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 resize-none"
              ></textarea>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col h-full">
          {/* Pickup Details Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Pickup Details
            </h2>
            {/* Date Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SELECT DATE
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 pr-4 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600"
                />
              </div>
            </div>
            {/* Time Slots */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AVAILABLE TIME SLOTS
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-green-600 bg-green-50 text-green-700 font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-300/50 bg-green-100"
                  style={{ borderWidth: 2 }}
                >
                  08:00 AM
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  10:00 AM
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  01:00 PM
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  03:00 PM
                </button>
              </div>
            </div>
            {/* Pickup Location */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PICKUP LOCATION
              </label>
              <div className="bg-gray-100 rounded-xl flex items-center gap-3 p-3 mb-2">
                {/* Static Map Placeholder */}
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {/* Replace the src below with a static Surabaya map image as needed */}
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=128&q=80"
                    alt="Map of Surabaya"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    Jl. Pemuda No. 12, Surabaya
                  </span>
                  <span className="text-xs text-gray-500">
                    Default location
                  </span>
                </div>
                <a
                  href="#"
                  className="text-green-700 font-semibold text-xs px-3 py-1 border border-green-600 rounded-lg hover:bg-green-50 transition whitespace-nowrap"
                >
                  CHANGE
                </a>
              </div>
            </div>
          </div>
          {/* Points Estimate & Button */}
          <div className="mt-auto">
            <div className="bg-green-50 rounded-xl flex items-center justify-between p-4 mb-5 border border-green-100">
              <div className="font-medium text-gray-700">Estimated Points</div>
              <div className="text-2xl font-bold text-green-700">+150 Pts</div>
            </div>
            <button
              type="button"
              className="w-full py-4 rounded-xl text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow transition"
            >
              Jadwalkan Penjemputan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}