"use client";

import {
  User,
  Lock,
  Pencil,
} from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Account Settings
        </h1>
        <p className="text-green-700 mt-2 max-w-2xl">
          Manage your profile details, security preferences, and notifications.
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
              <User className="w-6 h-6 text-green-600" />
            </span>
            <span className="font-bold text-gray-900 text-lg">Profile Information</span>
          </div>
          <button
            type="button"
            className="text-green-700 font-semibold hover:underline focus:outline-none"
          >
            Save Changes
          </button>
        </div>
        {/* Form Grid */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-300 text-gray-900 font-medium placeholder-gray-400"
                defaultValue="Jane Doe"
                placeholder="Full Name"
                autoComplete="off"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-300 text-gray-900 font-medium placeholder-gray-400"
                defaultValue="jane.doe@example.com"
                placeholder="Email Address"
                autoComplete="off"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-300 text-gray-900 font-medium placeholder-gray-400"
                defaultValue="+62 812 3456 7890"
                placeholder="Phone Number"
                autoComplete="off"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          {/* Location */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-300 text-gray-900 font-medium placeholder-gray-400"
                defaultValue="Mulyosari"
                placeholder="Location"
                autoComplete="off"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
            <Lock className="w-6 h-6 text-green-600" />
          </span>
          <span className="font-bold text-gray-900 text-lg">Security</span>
        </div>
        {/* Change Password Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
          <div>
            <div className="font-semibold text-gray-900">Change Password</div>
            <div className="text-green-700 text-sm mt-0.5">
              Update your password regularly to keep your account secure.
            </div>
          </div>
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2 rounded-full border border-gray-200 transition"
          >
            Update
          </button>
        </div>
        {/* New Password Input */}
        <div className="max-w-md">
          <label className="block text-xs text-gray-500 font-semibold mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-300 text-gray-900 font-medium placeholder-gray-400"
              placeholder="********"
              autoComplete="new-password"
            />
            <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Danger Zone / Logout Card */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex justify-end">
        <button
          type="button"
          className="border border-red-300 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium transition"
        >
          Logout Account
        </button>
      </div>
    </main>
  );
}